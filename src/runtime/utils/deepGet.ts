/**
 * Access deeply nested properties from an object using a path string.
 *
 * @param obj - The object to extract from
 * @param path - A path string like 'data.token' or '/access_token'
 * @returns The value at that path, or undefined if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function deepGet(obj: Record<string, any>, path?: string): any {
  if (!obj || typeof obj !== 'object' || !path) return undefined

  const cleanedPath = path.replace(/^\//, '').replace(/\[(\d+)\]/g, '.$1')
  const parts = cleanedPath.split('.')

  return parts.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}
