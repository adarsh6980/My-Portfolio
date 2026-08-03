targetScope = 'resourceGroup'

@description('Azure region for all regional resources.')
param location string = resourceGroup().location

@description('Names must be globally unique where Azure requires it (Static Web App, App Service, and SQL server).')
param staticWebAppName string
param apiAppName string
param sqlServerName string

@description('A Free plan is suitable only for experimentation; B1 is the cost-conscious production default.')
@allowed([
  'F1'
  'B1'
])
param appServicePlanSku string = 'B1'

@allowed([
  'Free'
  'Standard'
])
param staticWebAppSku string = 'Free'

@description('Provision Azure SQL. Leave false for the lowest-cost preview environment, which uses the API SQLite default until production settings are supplied.')
param deploySql bool = false

@description('Provision Key Vault. The API receives a system-assigned identity and Key Vault Secrets User when enabled.')
param deployKeyVault bool = false

@description('Allow connections from all Azure services to SQL. Keep false when deployment manages explicit App Service outbound IP rules.')
param allowAzureServicesToSql bool = false

@minLength(3)
@maxLength(24)
@description('Globally unique Key Vault name. The default is stable, valid, and independent of a potentially long App Service name.')
param keyVaultName string = 'kv-${take(uniqueString(resourceGroup().id, apiAppName), 11)}-portfolio'

@description('Azure SQL administrator login. Required only when deploySql is true.')
param sqlAdministratorLogin string = 'portfolioadmin'

@secure()
@description('Azure SQL administrator password. Supply only at deployment time when deploySql is true; do not put it in parameter files.')
param sqlAdministratorPassword string = ''

@description('Database name for the contact-submission store.')
param sqlDatabaseName string = 'portfolio'

@minValue(1)
@maxValue(4)
@description('Maximum serverless vCores. Verify availability with az sql db list-editions for the selected region before deploying.')
param sqlMaxVcores int = 1

@minValue(60)
@description('Minutes before a serverless Azure SQL database pauses. Set -1 only when an always-on database is required.')
param sqlAutoPauseDelay int = 60

@minValue(30)
@maxValue(730)
@description('Log Analytics retention period. 30 days avoids unnecessary retention cost.')
param logAnalyticsRetentionInDays int = 30

@description('Tags applied to every resource.')
param tags object = {
  application: 'portfolio'
  managedBy: 'bicep'
}

var appServicePlanName = '${apiAppName}-plan'
var logAnalyticsName = '${apiAppName}-logs'
var appInsightsName = '${apiAppName}-insights'

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: staticWebAppSku
    tier: staticWebAppSku
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: tags
}

resource apiPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    tier: appServicePlanSku == 'F1' ? 'Free' : 'Basic'
    size: appServicePlanSku
    capacity: 1
  }
  properties: {
    reserved: true
  }
  tags: tags
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: logAnalyticsRetentionInDays
  }
  tags: tags
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
    Request_Source: 'rest'
    RetentionInDays: logAnalyticsRetentionInDays
    DisableIpMasking: false
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  tags: tags
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: apiPlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: appServicePlanSku != 'F1'
      ftpsState: 'Disabled'
      healthCheckPath: '/api/health'
      http20Enabled: true
      linuxFxVersion: 'DOTNETCORE|10.0'
      minTlsVersion: '1.2'
    }
  }
  tags: tags
}

resource scmBasicAuthPolicy 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2023-12-01' = {
  parent: apiApp
  name: 'scm'
  properties: {
    allow: false
  }
}

resource ftpBasicAuthPolicy 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2023-12-01' = {
  parent: apiApp
  name: 'ftp'
  properties: {
    allow: false
  }
}

resource sqlServer 'Microsoft.Sql/servers@2023-08-01' = if (deploySql) {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdministratorLogin
    administratorLoginPassword: sqlAdministratorPassword
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    version: '12.0'
  }
  tags: tags
}

resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2023-08-01' = if (deploySql && allowAzureServicesToSql) {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01' = if (deploySql) {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'GP_S_Gen5'
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: sqlMaxVcores
  }
  properties: {
    autoPauseDelay: sqlAutoPauseDelay
    minCapacity: 1
    maxSizeBytes: 34359738368
    zoneRedundant: false
  }
  tags: tags
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = if (deployKeyVault) {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enablePurgeProtection: false
    softDeleteRetentionInDays: 7
    publicNetworkAccess: 'Enabled'
  }
  tags: tags
}

resource keyVaultSecretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (deployKeyVault) {
  name: guid(keyVault.id, apiApp.id, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    principalId: apiApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

output staticWebAppHostname string = staticWebApp.properties.defaultHostname
output apiHostname string = apiApp.properties.defaultHostName
output applicationInsightsConnectionString string = appInsights.properties.ConnectionString
output sqlServerFqdn string = deploySql ? sqlServer!.properties.fullyQualifiedDomainName : ''
output keyVaultUri string = deployKeyVault ? keyVault!.properties.vaultUri : ''
