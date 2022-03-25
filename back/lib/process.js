/**
 * A function that ensures a given callback is run before a script exits.
 * @param {*} callback
 */
export function onExit(callback) {
  // Ensure that on exit
  process.on("SIGTERM", (signal) => {
    console.log("\n\nSIGTERM received, closing script after callback()");
    callback();
    process.exit(0);
  });

  process.on("SIGINT", (signal) => {
    console.log("\nSIGINT received, closing script after callback()");
    callback();
    process.exit(0);
  });
}
