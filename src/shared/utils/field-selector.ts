export function pickFields<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): Partial<T> {
  if (!fields || fields.length === 0) {
    return obj
  }

  const result: Partial<T> = {}

  for (const field of fields) {
    if (field in obj) {
      result[field as keyof T] = obj[field]
    }
  }

  return result
}

export function validateFields(
  requestedFields: string[],
  allowedFields: string[]
): { isValid: boolean; invalidFields: string[] } {
  const invalidFields = requestedFields.filter(
    field => !allowedFields.includes(field)
  )

  return {
    isValid: invalidFields.length === 0,
    invalidFields,
  }
}

export function parseFieldsParam(fieldsParam?: string): string[] | undefined {
  if (!fieldsParam || fieldsParam.trim() === '') {
    return undefined
  }

  return fieldsParam
    .split(',')
    .map(field => field.trim())
    .filter(field => field.length > 0)
}
