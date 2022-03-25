/**
 * This is a function to support the reindexing of an index to a temporary
 * index and back into an index with the original name.
 */

// ! Make script create backup and in finally { ... } delete backup only
// ! if new index created

// ! BROKEN - deletes all docs for some reason

import { Client } from "@elastic/elasticsearch";
const esHost = "http://localhost:9200";
const esCli = new Client({ node: esHost });

export default async function reindex(
  indexName,
  indexMapAndSettings,
  newIndexName = ""
) {
  // Test connection
  console.log("Pinging elastic cluster...");
  await esCli
    .ping()
    .then(() => console.log(" > REACHABLE"))
    .catch((err) => {
      console.log(" > UNREACHABLE");
      console.log(err);
      throw new Error(err);
    })
    .catch((err) => reportErr(err));

  if (!newIndexName) newIndexName = indexName;

  const indexTempName = `${indexName}_temp`;

  console.log("Reindexing...");

  try {
    // Create temporary index with desired mappings and settings
    console.log(" 1. Creating temporary index with new mappings & settings.");
    await esCli.indices
      .create({ ...indexMapAndSettings, index: indexTempName })
      .catch((err) => reportErr(err));

    // Reindex to temporary index
    console.log(" 2. Reindexing original -> temp index.");
    await esCli
      .reindex({
        wait_for_completion: true,
        refresh: true,
        body: {
          source: {
            index: indexName,
          },
          dest: {
            index: indexTempName,
          },
        },
      })
      .catch((err) => reportErr(err));

    // Delete old index
    console.log(" 3. Deleting original index.");
    await esCli.indices
      .delete({ index: indexName })
      .catch((err) => reportErr(err));

    // Recreate old index with new mappings and settings, and new name if specified
    console.log(" 4. Recreating original index with new mappings & settings.");
    await esCli.indices
      .create({ ...indexMapAndSettings, index: newIndexName })
      .catch((err) => reportErr(err));

    // Reindex to old index
    console.log(" 5. Reindexing to from temp -> original index.");
    await esCli
      .reindex({
        wait_for_completion: true,
        refresh: true,
        body: {
          source: {
            index: indexTempName,
          },
          dest: {
            index: newIndexName,
          },
        },
      })
      .catch((err) => reportErr(err));

    // Delete temp index
    console.log(" 6. Deleting temporary index.");
    await esCli.indices
      .delete({ index: indexTempName })
      .catch((err) => reportErr(err));

    console.log("FINISHED!");
  } finally {
    // Iff old index is still present, delete temp inex
    console.log("FINALLY");
    console.log(indexTempName);
    if (
      (await esCli.indices.exists({ index: indexName })) &&
      (await esCli.indices.exists({ index: indexTempName }))
    ) {
      console.log("ERROR CLEANUP - Deleting temp index.");
      await esCli.indices.delete({ index: indexTempName }).catch((err) => {
        console.log("CLEANUP FAILED");
        console.log(err);
      });
    } else {
      console.log("WARNING:");
      console.log("  > Old index deleted, temp now remains.");
    }
  }
}

function reportErr(err) {
  console.log("Error while reindexing: ");
  console.log(err);
}
