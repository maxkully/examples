/* global db */

/* RESET SCRIPT */
db.accounts.remove({})
db.transactions.remove({})

/* STEP 0 */
/* Initialize Accounts */
db.accounts.insert(
   [
     { _id: "John Doe", balance: 1000, pendingTransactions: [] }, // source
     { _id: "Doe Johns", balance: 1000, pendingTransactions: [] } // destination
   ]
);

/* Initialize Transaction */
db.transactions.insert(
    { _id: 1, source: "John Doe", destination: "Doe Johns", value: 100, state: "initial", lastModified: new Date() }
)

/* STEP 1: Retrieve the transaction to start. */
var t = db.transactions.findOne( { state: "initial" } );

/* STEP 2: Update transaction state to pending. */
db.transactions.update(
    { _id: t._id, state: "initial" },
    {
      $set: { state: "pending" },
      $currentDate: { lastModified: true }
    }
);

/* STEP 3: Apply the transaction to both accounts. */
db.accounts.update(
   { _id: t.source, pendingTransactions: { $ne: t._id } },
   { $inc: { balance: -t.value }, $push: { pendingTransactions: t._id } }
);

db.accounts.update(
   { _id: t.destination, pendingTransactions: { $ne: t._id } },
   { $inc: { balance: t.value }, $push: { pendingTransactions: t._id } }
);

/* STEP 4: Update transaction state to applied. */
db.transactions.update(
   { _id: t._id, state: "pending" },
   {
     $set: { state: "applied" },
     $currentDate: { lastModified: true }
   }
);

/* STEP 5: Update both accounts’ list of pending transactions. */
db.accounts.update(
   { _id: t.source, pendingTransactions: t._id },
   { $pull: { pendingTransactions: t._id } }
);

db.accounts.update(
   { _id: t.destination, pendingTransactions: t._id },
   { $pull: { pendingTransactions: t._id } }
);

/* STEP 6: Update transaction state to done. */
db.transactions.update(
   { _id: t._id, state: "applied" },
   {
     $set: { state: "done" },
     $currentDate: { lastModified: true }
   }
);
