import mitt from 'mitt'

export const eventBus = mitt<{openImageFile: undefined}>()
