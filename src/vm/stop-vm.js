const {
  ClientSecretCredential,
  DefaultAzureCredential,
} = require("@azure/identity");
const { ComputeManagementClient } = require("@azure/arm-compute");

// Azure authentication in environment variables for DefaultAzureCredential
let credentials = null;
const tenantId =
  process.env["AZURE_TENANT_ID"] 
const clientId =
  process.env["AZURE_CLIENT_ID"] 
const secret =
  process.env["AZURE_CLIENT_SECRET"] 
const subscriptionId =
  process.env["AZURE_SUBSCRIPTION_ID"] 

const resourceGroupName = process.argv[2];
const vmResourceName = process.argv[3];

if (process.env.production) {
  // production
  credentials = new DefaultAzureCredential();
} else {
  // development
  credentials = new ClientSecretCredential(tenantId, clientId, secret);
  console.log("development");
}

async function stopVM() {
  const computeClient = new ComputeManagementClient(
    credentials,
    subscriptionId
  );
  const result = await computeClient.virtualMachines.beginDeallocate(
    resourceGroupName,
    vmResourceName
  );
  return result;
}

stopVM()
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((err) => {
    console.log(err);
  });
