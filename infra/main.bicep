targetScope = 'resourceGroup'

@description('The student subscription allows this deployment in Switzerland North.')
@allowed([
  'switzerlandnorth'
])
param location string = 'switzerlandnorth'

@description('Globally unique names for the App Service application and Azure SQL logical server.')
param apiAppName string
param sqlServerName string

@description('The preview is locked to App Service Free F1. A paid tier requires a reviewed template change.')
@allowed([
  'F1'
])
param appServicePlanSku string = 'F1'

@description('Azure SQL administrator login.')
param sqlAdministratorLogin string = 'portfolioadmin'

@secure()
@description('Azure SQL administrator password. Supply only at deployment time; never place it in parameter files.')
param sqlAdministratorPassword string

@description('Database name for contact submissions.')
param sqlDatabaseName string = 'portfolio'

@description('Tags applied to every resource.')
param tags object = {
  application: 'portfolio'
  environment: 'preview'
  managedBy: 'bicep'
}

var appServicePlanName = '${apiAppName}-plan'

resource apiPlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    tier: 'Free'
    size: appServicePlanSku
    capacity: 1
  }
  properties: {
    reserved: true
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
      alwaysOn: false
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

resource sqlServer 'Microsoft.Sql/servers@2023-08-01' = {
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

resource sqlDatabase 'Microsoft.Sql/servers/databases@2025-01-01' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'GP_S_Gen5'
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: 1
  }
  properties: {
    autoPauseDelay: 60
    freeLimitExhaustionBehavior: 'AutoPause'
    licenseType: 'LicenseIncluded'
    maxSizeBytes: 34359738368
    requestedBackupStorageRedundancy: 'Local'
    useFreeLimit: true
    zoneRedundant: false
  }
  tags: tags
}

output apiHostname string = apiApp.properties.defaultHostName
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
