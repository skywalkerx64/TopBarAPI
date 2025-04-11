import vine from '@vinejs/vine'

export const updateLinkValidator = vine.compile(
  vine.object({
    url: vine.string().url().optional(),
    message: vine.string().optional(),
    backgroundColor: vine.string().optional(),
    textColor: vine.string().optional(),
    gifUrl: vine.string().optional(),
  })
)
