// Web shim for expo-sqlite (not supported on web)
export async function openDatabaseAsync() {
  return null;
}
