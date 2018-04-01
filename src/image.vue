<template>
    <div class="vueImgEnhanced" :style="getImageContainerStyle">
        <transition name="fade" v-if="blurImage">
            <img v-show="loading" :style="getBlurImageStyle" width="100%" ref="blurImageContainer" />
        </transition>
        <slot name="progressbar" :value="progressValue">
            <progress :style="getProgressStyle" v-show="loading" :value="progressValue" max="100" style="width: 100%;"></progress>
        </slot>
        <transition name="fade">
            <img v-show="!loading" :style="getImageStyle" width="100%" ref="imageContainer" />
        </transition>
    </div>
</template>

<script>
export default {
    name: 'v-img-enhanced',
    props: {
        src: {
            type: String,
            required: true
        },
        blurSrc: {
            type: String,
            required: false
        },
        width: {
            type: String,
            required: false
        },
        blur: {
            type: Number,
            default: 10
        }
    },
    mounted () {
        this.setBlurImage()
        this.initImage()
    },
    watch: {
        'src': function (src) {
            this.initImage()
        },
        'blurSrc': function (src) {
            this.setBlurImage()
        }
    },
    methods: {
        onLoad (imgSrc) {
            this.loading = false
            this.$emit('onload', imgSrc)
        },
        onError (xhr) {
            this.loading = false
            this.$emit('onerror', xhr)
        },
        onProgress (ratio) {
            this.$emit('onprogress', ratio)
        },
        /**
         * https://stackoverflow.com/a/42196770
         * Loads an image with progress callback.
         *
         * The `onprogress` callback will be called by XMLHttpRequest's onprogress
         * event, and will receive the loading progress ratio as an whole number.
         * However, if it's not possible to compute the progress ratio, `onprogress`
         * will be called only once passing -1 as progress value. This is useful to,
         * for example, change the progress animation to an undefined animation.
         *
         * @param  {string}   imageUrl   The image to load
         * @param  {Function} onprogress
         * @return {Promise}
         */
        loadImage (imageUrl, onprogress) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest()
                var notifiedNotComputable = false

                xhr.open('GET', imageUrl, true)
                xhr.responseType = 'arraybuffer'

                xhr.onprogress = function (event) {
                    if (event.lengthComputable) {
                        onprogress(parseInt((event.loaded / event.total) * 100))
                    } else {
                        if (!notifiedNotComputable) {
                            notifiedNotComputable = true
                            onprogress(-1)
                        }
                    }
                }

                xhr.onloadend = function () {
                    if (!xhr.status.toString().match(/^2/)) {
                        reject(xhr)
                    } else {
                        if (!notifiedNotComputable) {
                            onprogress(100)
                        }

                        var options = {}
                        var headers = xhr.getAllResponseHeaders()
                        var contentType = headers.match(/^Content-Type\:\s*(.*?)$/mi)

                        if (contentType && contentType[1]) {
                            options.type = contentType[1]
                        }
                        var blob = new Blob([this.response], options)
                        resolve(window.URL.createObjectURL(blob))
                    }
                }

                xhr.send()
            })
        },
        blurImage () {
            this.$refs.blurImageContainer.src = this.blurSrc
        },
        initImage () {
            this.loading = true
            var _this = this
            var imageContainer = _this.$refs.imageContainer
            var imageUrl = _this.src

            _this.loadImage(imageUrl, (ratio) => {
                if (ratio === -1) {
                    // Ratio not computable. Let's make this bar an undefined one.
                    // Remember that since ratio isn't computable, calling this function
                    // makes no further sense, so it won't be called again.
                    _this.progressValue = -1
                } else {
                    // We have progress ratio; update the bar.
                    _this.progressValue = ratio
                    _this.onProgress(ratio)
                }
            }).then(imgSrc => {
                // Loading successfuly complete; set the image and probably do other stuff.
                imageContainer.src = imgSrc
                _this.progressValue = 0
                _this.onLoad(imgSrc)
            }, xhr => {
                // An error occured. We have the XHR object to see what happened.
                _this.progressValue = 0
                _this.onError(xhr)
            })
        },
        setBlurImage () {
            if (typeof this.blurSrc !== 'undefined') {
                this.$refs.blurImageContainer.src = this.blurSrc
            }
        }
    },
    computed: {
        getImageContainerStyle () {
            if (typeof this.blurSrc !== 'undefined') {
                return {
                    width: this.width
                }
            } else {
                return {
                    width: '100%'
                }
            }
        },
        getBlurImageStyle () {
            if (this.blur === 0) {
                return
            }
            return {
                filter: `blur(${this.blur}px)`
            }
        },
        getImageStyle () {
            if (typeof this.blurSrc !== 'undefined') {
                return {
                    position: 'relative',
                    left: '0',
                    top: '0'
                }
            }
        },
        getProgressStyle () {
            return {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }
        }
    },
    data: () => ({
        progressValue: 0,
        loading: false
    })
}
</script>

<style>
    .vueImgEnhanced {
        position:relative;
        display:inline-block;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        position: absolute !important;
    }
</style>