var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org",
);

var issuerKeys = StellarSdk.Keypair.fromSecret("");
var receivingKeys = StellarSdk.Keypair.fromSecret("");

var GoldAsset = new StellarSdk.Asset("Gold", issuerKeys.publicKey());
var LandAsset = new StellarSdk.Asset("Land", issuerKeys.publicKey());

server.loadAccount(issuerKeys.publicKey())
.then(function (issuer) {
var transaction = new StellarSdk.TransactionBuilder(issuer, {
fee: StellarSdk.BASE_FEE,
networkPassphrase: StellarSdk.Networks.TESTNET,
})
.addOperation(StellarSdk.Operation.setOptions({
setFlags: StellarSdk.AuthClawbackEnabledFlag | StellarSdk.AuthRevocableFlag
}))
.setTimeout(100)
.build();

transaction.sign(issuerKeys);
return server.submitTransaction(transaction);
})
.then(() => {

return server.loadAccount(receivingKeys.publicKey());
})
.then(function (receiver) {
var transaction = new StellarSdk.TransactionBuilder(receiver, {
fee: StellarSdk.BASE_FEE,
networkPassphrase: StellarSdk.Networks.TESTNET,
})
.addOperation(
StellarSdk.Operation.changeTrust({
asset: LandAsset,
limit: "1000"
})
)
.addOperation(
StellarSdk.Operation.changeTrust({
asset: GoldAsset,
limit: "3000"
})
)
.setTimeout(100)
.build();

transaction.sign(receivingKeys);
return server.submitTransaction(transaction);
})
.then(() => {
return server.loadAccount(issuerKeys.publicKey());
})
.then(function (issuer) {
var transaction = new StellarSdk.TransactionBuilder(issuer, {
fee: StellarSdk.BASE_FEE,
networkPassphrase: StellarSdk.Networks.TESTNET,
})
.addOperation(
StellarSdk.Operation.payment({
destination: receivingKeys.publicKey(),
asset: LandAsset,
amount: "10",
})
)
.addOperation(
StellarSdk.Operation.payment({
destination: receivingKeys.publicKey(),
asset: GoldAsset,
amount: "1000",
})
)
.setTimeout(100)
.build();

transaction.sign(issuerKeys);
return server.submitTransaction(transaction);
})
.then(console.log)
.catch(function (error) {
console.error("Error!", error);
});