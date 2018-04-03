import VueImg from 'src/image.vue'
import { createVM } from '../helpers/utils.js'

describe('image.vue', function () {
    it('should render', function () {
        const vm = createVM(this, `
      <v-img-enhanced 
        src="https://images.unsplash.com/photo-1522093537031-3ee69e6b1746?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a634781c01d2dd529412c2d1e2224ec0&auto=format&fit=crop&w=3200&q=100"
        blur-src="https://images.unsplash.com/photo-1522093537031-3ee69e6b1746?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a634781c01d2dd529412c2d1e2224ec0&auto=format&fit=crop&w=100&q=1"
      ></v-img-enhanced>
    `, { components: { VueImg }})
        vm.$el.querySelector('.vueImgEnhanced')
    })

    it('should render custom progressbar', function () {
        const vm = createVM(this, `
      <v-img-enhanced 
        src="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dd093986e77ede3c4c6fcaba42fdf544&auto=format&fit=crop&w=1920&q=100"
        blur-src="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dd093986e77ede3c4c6fcaba42fdf544&auto=format&fit=crop&w=100&q=1"
      >
        <template slot="progressbar" slot-scope="{ value }">
          <span style="font-size:35px;font-weight:900;position:absolute;top:0;">{{value}}</span>
        </template>
      </v-img-enhanced>
    `, { components: { VueImg }})
        vm.$el.querySelector('.vueImgEnhanced')
    })
})
