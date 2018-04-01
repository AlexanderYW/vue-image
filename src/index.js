import Image from './image.vue'

function plugin (Vue) {
    Vue.component(Image.name, Image)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
}

export default plugin
const version = '__VERSION__'
// Export all components too
export {
  Image,
  version
}
