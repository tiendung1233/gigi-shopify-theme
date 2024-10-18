if (!customElements.get('media-gallery')) {
  customElements.define(
      'media-gallery',
      class MediaGallery extends HTMLElement {
        constructor() {
          super();
          let self = this;
          this.elements = {
            liveRegion: this.querySelector('[id^="GalleryStatus"]'),
            viewer: this.querySelector('[id^="GalleryViewer"]'),
            thumbnails: this.querySelector('[id^="GalleryThumbnails"]'),
          };
          this.mql = window.matchMedia('(min-width: 750px)');
          if (!this.elements.thumbnails) return;

          this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 500));
          this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
            mediaToSwitch
                .querySelector('button')
                .addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
          });

          if (this.dataset.desktopLayout.includes('thumbnail') && this.mql.matches) this.removeListSemantic();
          let sliderMain = this.querySelector('.product__media-list');
          let positionFinal = sliderMain.querySelectorAll('li').length;

          document.querySelector('body').style.overflow = 'hidden';
          scrollTo(0,0)
          let maxHeight = Number(window.screen.height) - Number(document.querySelector('.gigi-header-container').offsetHeight)
          //sliderMain.style.maxHeight = (maxHeight - 140) + 'px';

          //sliderMain.querySelector('li').querySelector('.product__media').style.paddingTop = maxHeight + 'px';

          document.addEventListener("wheel", function(e){
            sliderMain.scrollBy(e.deltaX, e.deltaY);
            let sliderThumbnail = self.querySelector('.thumbnail-list');
            let thumbnailActive = sliderThumbnail.querySelector('button[aria-current="true"]');
            let position =  Number(thumbnailActive.closest('li').getAttribute('data-media-position'));
            let positionNext = (position + 1 > positionFinal) ? positionFinal : position + 1;
            let positionPrev = (position - 1 < 0) ? 0 : position - 1;

            if (e.deltaY > 0) {
              //scrollDown
              if (positionNext <= positionFinal) {
                let mediaId = sliderThumbnail.querySelector(`li[data-media-position="${positionNext}"]`).getAttribute('data-target');
                self.setActiveMedia(mediaId, false);
              }
              if(positionNext >= positionFinal) {
                document.querySelector('body').style.overflow = '';
              }
            } else {
              //scrollUp
              let elDiv = document.querySelector('.media-gallery-viewer');
              if(self.isInViewport(elDiv)) {
                if(positionPrev > 0) {
                  let mediaId = sliderThumbnail.querySelector(`li[data-media-position="${positionPrev}"]`).getAttribute('data-target');
                  self.setActiveMedia(mediaId, false);
                  document.querySelector('body').style.overflow = 'hidden';
                }
                if (self.isInViewport(elDiv) && positionPrev > 0) {
                  let mediaId = sliderThumbnail.querySelector(`li[data-media-position="${positionPrev}"]`).getAttribute('data-target');
                  self.setActiveMedia(mediaId, false);
                }
              }
            }
          });
        }

        isInViewport(element) {
          if(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0
            );
          }
          return false
        }

        onSlideChanged(event) {
          if (event.detail.currentElement && event.detail.currentElement.dataset) {
            const mediaId = event.detail.currentElement.dataset.mediaId;
            const thumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
            this.setActiveThumbnail(thumbnail);
          }
        }

        setActiveMedia(mediaId, prepend) {
          const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${mediaId}"]`);
          if(!activeMedia) return;
          this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
            element.classList.remove('is-active');
          });
          activeMedia.classList.add('is-active');

          if (prepend) {
            activeMedia.parentElement.prepend(activeMedia);
            if (this.elements.thumbnails) {
              const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
              activeThumbnail?.parentElement?.prepend(activeThumbnail);
            }
            if (this.elements.viewer.slider) this.elements.viewer.resetPages();
          }

          this.preventStickyHeader();
          window.setTimeout(() => {
            if (this.elements.thumbnails) {
              activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft });
            }
            if (!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked') {
              activeMedia.scrollIntoView({ behavior: 'smooth' });
            }
          });
          this.playActiveMedia(activeMedia);

          if (!this.elements.thumbnails) return;
          const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
          this.setActiveThumbnail(activeThumbnail);
          this.announceLiveRegion(activeMedia, activeThumbnail?.dataset?.mediaPosition);
          const sliderThumbnail = document.querySelector('.thumbnail-list');
          const thumbnailActive = sliderThumbnail.querySelector('button[aria-current="true"]');
          const liElement = thumbnailActive.closest('li');
          if (liElement) {
            const scrollTo = liElement.offsetTop - sliderThumbnail.offsetTop;
            sliderThumbnail.scrollTop = scrollTo;
          }
          let indexRunSetPaddingTop = 0
          let setPaddingTop = setInterval(function () {
            let position =  Number(thumbnailActive.closest('li').getAttribute('data-media-position'));
            let maxHeight = Number(window.screen.height) - Number(document.querySelector('.gigi-header-container').offsetHeight)
            let mediaActive = sliderThumbnail.querySelector(`li[data-media-position="${position}"]`).getAttribute('data-target')
            let idMediaActive = 'Slide-' + mediaActive;
            let sliderActive = document.getElementById(`${idMediaActive}`);
            //sliderActive.querySelector('.product__media').style.paddingTop = maxHeight + 'px';
            indexRunSetPaddingTop ++
            console.log('set Padding')
            if(indexRunSetPaddingTop > 10) {
              if(setPaddingTop) {clearInterval(setPaddingTop)}
            }
          },200)
        }

        setActiveThumbnail(thumbnail) {
          if (!this.elements.thumbnails || !thumbnail) return;

          this.elements.thumbnails
              .querySelectorAll('button')
              .forEach((element) => element.removeAttribute('aria-current'));
          thumbnail.querySelector('button').setAttribute('aria-current', true);
          if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

          this.elements.thumbnails.slider.scrollTo({ left: thumbnail.offsetLeft });
        }

        announceLiveRegion(activeItem, position) {
          const image = activeItem.querySelector('.product__modal-opener--image img');
          if (!image) return;
          image.onload = () => {
            this.elements.liveRegion.setAttribute('aria-hidden', false);
            this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace('[index]', position);
            setTimeout(() => {
              this.elements.liveRegion.setAttribute('aria-hidden', true);
            }, 2000);
          };
          image.src = image.src;
        }

        playActiveMedia(activeItem) {
          window.pauseAllMedia();
          const deferredMedia = activeItem.querySelector('.deferred-media');
          if (deferredMedia) deferredMedia.loadContent(false);
        }

        preventStickyHeader() {
          this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
          if (!this.stickyHeader) return;
          this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
        }

        removeListSemantic() {
          if (!this.elements.viewer.slider) return;
          this.elements.viewer.slider.setAttribute('role', 'presentation');
          this.elements.viewer.sliderItems.forEach((slide) => slide.setAttribute('role', 'presentation'));
        }
      }
  );
}
