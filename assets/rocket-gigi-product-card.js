(function() {
    "use strict";
    class VariantPicker extends HTMLElement {
        constructor() {
            super();
            this.addEventListener("change", this.onVariantChange);
            this.productId = this.getAttribute('data-product-id');

            this.openModal();
            this.closeModal();
        }

        openModal() {
            let toggleBtn = this.querySelector('.quick-add__submit');

            toggleBtn.addEventListener('click', () => {
                let modalId = toggleBtn.closest('div.toggle-modal').getAttribute('data-modal');
                document.querySelector(modalId).classList.toggle('hidden');
            })
        }
        closeModal() {
            let closeBtn = this.querySelector('.modal__close-button');

            closeBtn.addEventListener('click', () => {
                console.log('#QuickAdd-' + this.productId);
                console.log(closeBtn);
                closeBtn.closest('#QuickAdd-' + this.productId).classList.add('hidden');
            })
        }
    }

    customElements.define("variant-picker", VariantPicker);

    class VariantOptions extends HTMLElement {
        constructor() {
            super();
            this.variantChange();
        }

        variantChange() {
            let variantOptions = this.querySelectorAll('.product-option__item');

            variantOptions.forEach((option) => {
                option.addEventListener('click', () => {
                    option.parentElement.querySelectorAll('.product-option__item').forEach((el) => {
                        el.classList.remove('selected');
                    })

                    option.classList.add('selected');
                })
            })
        }
    }

    customElements.define("variant-options", VariantOptions);

    class GIGI_Slider extends HTMLElement {
        constructor() {
            super();
        }
    }

    customElements.define("gigi-slider", GIGI_Slider);
}.call(self));