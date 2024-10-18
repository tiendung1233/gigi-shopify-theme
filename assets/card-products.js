class cardProduct extends HTMLElement {
    constructor() {
        super();
        let self = this;

        if(this.querySelector('.btn-quick-add-cart')) {
            this.querySelector('.btn-quick-add-cart').addEventListener('click', async function () {
                await self.openPopUpQuickAddCart()
            });
        }

        if(this.querySelector('.quantity-color')) {
            this.querySelector('.quantity-color').addEventListener('click', async function () {
                await self.openPopUpQuickAddCart()
            });
        }

        this.addEventListener('mouseover', function () {
            if(!this.classList.contains('renderSlider')) {
                let idProduct = this.getAttribute('data-id');
                let idSection =  this.getAttribute('data-id-section')
                let nameSliderThumbnail = '.slider-thumbnail-' + idProduct + '-' + idSection;
                let nameSlider = '.slider-' + idProduct + '-' + idSection;
                let nameNext = '.swiper-button-next-'+ idProduct + '-' + idSection;
                let namePrev = '.swiper-button-prev-'+ idProduct + '-' + idSection;
                let nameScrollBar = '.swiper-scrollbar-' + idProduct + '-' + idSection;
                self.initSwiper(nameSliderThumbnail, nameSlider, nameNext, namePrev, nameScrollBar)
                this.classList.add('renderSlider');
            }
        });
        this.cart =
            document.querySelector("cart-notification") ||
            document.querySelector("cart-drawer");
    }

    resetPopupMobile(colorSelect) {
        if(!colorSelect && window.screen.width <= 768) {
            document.getElementById('model-quick-add-mobile').classList.remove('active')
            document.querySelector('.product-card-drawer').style.visibility = "visible";
            document.getElementById('model-quick-add-mobile').querySelector('.variant-color').classList.add('active');
            document.getElementById('model-quick-add-mobile').querySelector('.variant-option').classList.remove('active');
        }
    }

    async getDataVariationProduct(url) {
        let res =  await fetch(url);
        return new DOMParser().parseFromString(await res.text(), "text/html");
    }

    async addProductToCartWhenOnlyOption(selectOption) {
        let self = this;
        self.clearError();
        if (this.querySelector('.add-to-cart-button-class')) {
            this.querySelector('.add-to-cart-button-class').classList.remove('error');
        }
        let idVariant = selectOption.querySelector('option').value;
        this.querySelector('.btn-quick-add-cart').querySelector('.loading__spinner').classList.remove('hidden');
        this.querySelector('.btn-quick-add-cart').querySelector('.icon-add-cart').classList.add('hidden');
        await self.addToCart(idVariant, self);
        this.querySelector('.btn-quick-add-cart').querySelector('.loading__spinner').classList.add('hidden');
        this.querySelector('.btn-quick-add-cart').querySelector('.icon-add-cart').classList.remove('hidden');
    }

    openOrCloseLoadingCart(status) {
        if(status == 'open') {
            this.querySelector('.btn-quick-add-cart').querySelector('.loading__spinner').classList.remove('hidden');
            this.querySelector('.btn-quick-add-cart').querySelector('.icon-add-cart').classList.add('hidden');
        } else {
            this.querySelector('.btn-quick-add-cart').querySelector('.loading__spinner').classList.add('hidden');
            this.querySelector('.btn-quick-add-cart').querySelector('.icon-add-cart').classList.remove('hidden');
        }
    }

    async openPopUpQuickAddCart(colorSelect = false) {
        let self = this;
        let parent = this.closest('.item-product-add-cart');
        let typeProduct = this.getAttribute('data-type-product');

        self.openOrCloseLoadingCart('open')

        this.resetPopupMobile(colorSelect)

        await self.renderContentPopup(typeProduct, parent, self)

        if(typeProduct == 'simple' || this.querySelector('.option-varian-1') || document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1')) {
            if ((typeProduct == 'simple' && window.screen.width > 768)
                || this.querySelector('.option-varian-1:checked')
                || document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked'))
            {
                let productIdSelect = null, urlProduct = null;
                if(this.querySelector('.option-varian-1:checked')) {
                    productIdSelect = this.querySelector('.option-varian-1:checked').getAttribute('data-product-id')
                    urlProduct = this.querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
                }
                if(document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked')) {
                    productIdSelect = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-id')
                    urlProduct = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
                }
                let elProduct = this, selectOption = null;
                if(typeProduct == 'bundle') {
                    elProduct = document.querySelector(`slider-image-card[data-id="${productIdSelect}"]`);
                }
                if(elProduct) {
                    selectOption = elProduct.querySelector('.main_product_form_varaiants_class')
                } else {
                    let doc = await self.getDataVariationProduct(urlProduct)
                    selectOption = doc.getElementById('content-pdp').querySelector('#products-select-variants')
                }
                if (selectOption.querySelectorAll('option').length <= 1) {
                    await self.addProductToCartWhenOnlyOption(selectOption);
                    this.querySelector('.btn-quick-add-cart').setAttribute('data-open', "true");
                    self.openOrCloseLoadingCart('close')
                    return
                }
            } else {
                if (window.screen.width <= 768) {
                    self.openOrCloseLoadingCart('close')
                    await this.renderPopupMobile(self, typeProduct);
                    return
                } else {
                    self.openOrCloseLoadingCart('close')
                    this.showError('Please choose option');
                    this.querySelector('.add-to-cart-button-class').classList.add('error');
                    return
                }
            }
        } else {
            let selectOption = self.querySelector('.main_product_form_varaiants_class');
            if (selectOption.querySelectorAll('option').length <= 1) {
                self.openOrCloseLoadingCart('close')
                await self.addProductToCartWhenOnlyOption(selectOption)
                return
            }
        }
        self.openOrCloseLoadingCart('close')
    }

    async renderContentPopup(typeProduct, parent, self) {
        let statusOpen = this.querySelector('.btn-quick-add-cart').getAttribute('data-open');
        if(statusOpen == 'false') {
            this.querySelector('.popup-quick-add').classList.remove('active');
            this.querySelector('.btn-quick-add-cart').setAttribute('data-open', "true");
            if (this.querySelector('.add-to-cart-button-class')) {
                this.querySelector('.add-to-cart-button-class').classList.remove('notshow');
            }
            return
        }

        if(parent.querySelector('.card-slider-media').querySelector('.popup-quick-add')) {
            parent.querySelector('.card-slider-media').querySelector('.popup-quick-add').remove()
        }
        if(document.getElementById('model-quick-add-mobile').querySelector('.variant-option')) {
            document.getElementById('model-quick-add-mobile').querySelector('.variant-option').innerHTML = '';
        }
        if (typeProduct == 'simple' || this.querySelector('.option-varian-1:checked') || document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked')) {
            if (this.querySelector('.card_product_class').querySelector('.notification.error')) {
                this.querySelector('.card_product_class').querySelector('.notification.error').remove();
            }
            if (this.querySelector('.add-to-cart-button-class')) {
                this.querySelector('.add-to-cart-button-class').classList.remove('error')
            }


            if (!this.querySelector('.popup-quick-add')) {
                let selectOption = null;
                let elPopupChoose = document.createElement('div');
                elPopupChoose.className = 'popup-quick-add';
                let productIdSelect = null, urlProduct = null;
                if (this.querySelector('.option-varian-1:checked')) {
                    productIdSelect = this.querySelector('.option-varian-1:checked').getAttribute('data-product-id');
                    urlProduct = this.querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
                }
                if (document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked')) {
                    productIdSelect = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-id')
                    urlProduct = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
                }
                let elProduct = this;
                if (typeProduct == 'bundle') {
                    elProduct = document.querySelector(`slider-image-card[data-id="${productIdSelect}"]`);
                }
                let jsonData = null
                if (elProduct) {
                    jsonData = elProduct.querySelector('script[type="application/json"]');
                    selectOption = elProduct.querySelector('.main_product_form_varaiants_class')
                } else {
                    let doc = await self.getDataVariationProduct(urlProduct)
                    selectOption = doc.getElementById('content-pdp').querySelector('#products-select-variants');
                    jsonData = doc.getElementById('content-pdp').querySelector('script[type="application/json"]');

                }
                if (selectOption.querySelectorAll('option').length > 1) {
                    elPopupChoose.classList.add('active')
                }
                jsonData = jsonData.innerHTML;
                let dataVariation = JSON.parse(jsonData);

                let hasItemVariant = false;
                if (jsonData) {
                    let content = "<div class='title'><h2>Ajustar</h2></div>";
                    let onlySize = true;
                    let index = 2;
                    dataVariation.forEach(item => {
                        if (item.name != 'Color') {
                            let classOnly = item.values.length <= 1 ? 'option-varian-select-only' : '';
                            content += `<div class="option-varian-${item.name} option-varian-select ${classOnly}">`;
                            item.values.forEach(option => {
                                content += `<input class="option-varian-${index}" type="radio" id="option-${item.name}-${option}" value="${option}" name="option-${item.name}"><label class="option-varian" for="option-${item.name}-${option}">${option}</label>`;
                            });
                            content += `</div>`;
                            if (item.name != 'Calibre') {
                                onlySize = false;
                            }
                            hasItemVariant = true;
                            index++
                        }
                    });

                    if (hasItemVariant) {
                        content += '<div class="btn-submit-quick-add-cart">Añadir al carrito <div class="loading__spinner hidden">' +
                            '  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="61px" height="61px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n' +
                            '    <circle cx="50" cy="50" fill="none" stroke="#000" stroke-width="11" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(220.188 50 50)">\n' +
                            '      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>\n' +
                            '    </circle>\n' +
                            '  </svg></div></div>';
                    }
                    if (onlySize) {
                        elPopupChoose.classList.add('only-variant-size')
                    }
                    elPopupChoose.innerHTML = content;
                    if (window.screen.width > 768) {
                        parent.querySelector('.card-slider-media').appendChild(elPopupChoose);
                        if (this.querySelector('.btn-submit-quick-add-cart')) {
                            this.querySelector('.btn-submit-quick-add-cart').addEventListener('click', async function () {
                                await self.quickAddCart();
                            })
                        }
                        this.querySelector('.btn-quick-add-cart').setAttribute('data-open', "false")
                        if (this.querySelector('.add-to-cart-button-class')) {
                            this.querySelector('.add-to-cart-button-class').classList.add('notshow');
                        }
                    } else {
                        document.getElementById('model-quick-add-mobile').querySelector('.variant-option').innerHTML =
                            elPopupChoose.innerHTML;
                        if (typeProduct == 'bundle') {
                            let elBack = document.createElement('div');
                            elBack.className = 'btn-back';
                            elBack.innerHTML = 'Seleccionar otra';
                            elBack.addEventListener('click', function () {
                                document.getElementById('model-quick-add-mobile').querySelector('.title').innerHTML = 'Seleccionar producto';
                                document.getElementById('model-quick-add-mobile').querySelector('.variant-color').classList.add('active')
                                document.getElementById('model-quick-add-mobile').querySelector('.variant-option').classList.remove('active')
                            })
                            document.getElementById('model-quick-add-mobile').querySelector('.variant-option').appendChild(elBack);
                        } else {
                            document.getElementById('model-quick-add-mobile').querySelector('.btn-submit-quick-add-cart').classList.add('btn-full-width')
                        }

                        if (document.getElementById('model-quick-add-mobile').querySelector('.btn-submit-quick-add-cart')) {
                            document.getElementById('model-quick-add-mobile').querySelector('.btn-submit-quick-add-cart').addEventListener('click', async function () {
                                await self.quickAddCart();
                            })
                        }
                        document.getElementById('model-quick-add-mobile').querySelector('.variant-color').classList.remove('active');
                        document.getElementById('model-quick-add-mobile').querySelector('.variant-option').classList.add('active');
                    }
                }
            } else {
                let statusOpen = this.querySelector('.btn-quick-add-cart').getAttribute('data-open');
                if (statusOpen == "true") {
                    this.querySelector('.popup-quick-add').classList.add('active');
                    this.querySelector('.btn-quick-add-cart').setAttribute('data-open', "false");
                    if (this.querySelector('.add-to-cart-button-class')) {
                        this.querySelector('.add-to-cart-button-class').classList.add('notshow');
                    }
                }
            }
        }
    }

    initSwiper(nameSliderThumbnail, nameSlider, nameNext, namePrev,nameScrollBar) {
        var sliderThumbnail = new Swiper(`${nameSliderThumbnail}`, {
            slidesPerView: 'auto',
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            scrollbar: {
                el: `${nameScrollBar}`,
                hide: false,
            },
        });
        var slider = new Swiper(`${nameSlider}`, {
            navigation: {
                nextEl: `${nameNext}`,
                prevEl: `${namePrev}`,
            },
            thumbs: {
                swiper: sliderThumbnail
            },
            on: {
                'slideChange': function () {
                    sliderThumbnail.slideTo(slider.activeIndex);
                }
            }
        });
    }

    async renderPopupMobile(self, typeProduct) {
        let modelMobile = document.getElementById('model-quick-add-mobile');
        modelMobile.querySelector('.title').innerHTML = 'Seleccionar producto';

        if (typeProduct == 'simple') {
            let urlProduct = this.querySelector('.pdp-normal').querySelector('a').getAttribute('href')
            let doc = await self.getDataVariationProduct(urlProduct)
            let img = this.querySelector('.pdp-normal').querySelector('img')
            self.openTabMobileOnly(img.getAttribute('src'), doc, typeProduct)
        } else {
            if (self.querySelector('.add-to-cart-button-class')) {
                modelMobile.querySelector('.variant-color').innerHTML =
                    self.querySelector('.add-to-cart-button-class').innerHTML;
            }
        }

        modelMobile.classList.add('active');
        document.querySelector('.product-card-drawer').style.visibility = "visible";
        modelMobile.querySelector('.variant-color').classList.remove('active');
        modelMobile.querySelector('.variant-option').classList.remove('active');

        if (typeProduct == 'bundle') {
            modelMobile.querySelector('.variant-color').classList.add('active');
        } else {
            modelMobile.querySelector('.variant-option').classList.add('active');
        }


        modelMobile.querySelector('.btn-close-popup').addEventListener('click', function () {
            modelMobile.classList.remove('active')
            document.querySelector('.product-card-drawer').style.visibility = "hidden";
            modelMobile.querySelector('.variant-color').innerHTML = '';
            modelMobile.querySelector('.variant-option').innerHTML = '';
        })
        document.querySelector('.product-card-drawer').addEventListener('click', function () {
            modelMobile.classList.remove('active')
            document.querySelector('.product-card-drawer').style.visibility = "hidden";
            modelMobile.querySelector('.variant-color').innerHTML = '';
            modelMobile.querySelector('.variant-option').innerHTML = '';
        })
        if (typeProduct == 'bundle') {
            modelMobile.querySelector('.variant-color').querySelector('.slider-thumbnail').className = 'swiper-container slider-thumbnail-mobile';
            modelMobile.querySelector('.variant-color')
                .querySelectorAll('input[type="radio"]').forEach(input => {
                input.name = 'mobile-' + input.name;
                let id = input.id;
                let idNew = 'mobile-' + id;
                input.setAttribute('id', idNew);
                modelMobile.querySelector(`label[for="${id}"]`).setAttribute('for', idNew)
                input.addEventListener('click', async function () {
                    let productIdSelect = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-id');
                    let elProduct = this;
                    if (typeProduct == 'bundle') {
                        elProduct = document.querySelector(`slider-image-card[data-id="${productIdSelect}"]`);
                    }

                    let urlProduct = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
                    let selectOption = null

                    let doc = await self.getDataVariationProduct(urlProduct)

                    if (elProduct) {
                        selectOption = elProduct.querySelector('.main_product_form_varaiants_class')
                    } else {
                        selectOption = doc.getElementById('content-pdp').querySelector('#products-select-variants');
                    }
                    if (selectOption.querySelectorAll('option').length > 1) {
                        await self.openPopUpQuickAddCart(true);
                    } else {
                        let parent = input.closest('div'), img = parent.querySelector('img');
                        self.openTabMobileOnly(img.getAttribute('src'), doc)
                    }
                })
            })
        }

        let idProduct = self.getAttribute('data-id');
        let idSection = this.getAttribute('data-id-section')
        let nameSliderThumbnail = '.slider-thumbnail-mobile';
        let nameSlider = '.slider-' + idProduct + '-' + idSection;
        let nameNext = '.swiper-button-next-' + idProduct + '-' + idSection;
        let namePrev = '.swiper-button-prev-' + idProduct + '-' + idSection;

        self.initSwiper(nameSliderThumbnail, nameSlider, nameNext, namePrev);
    }

    openTabMobileOnly(imgSrc, doc,typeProduct = null) {
        let self = this;
        let modelMobile = document.getElementById('model-quick-add-mobile');
        modelMobile.querySelector('.variant-color').classList.remove('active');
        modelMobile.querySelector('.variant-option').classList.add('active');
        modelMobile.querySelector('.title').innerHTML = 'Añadido al carrito';
        modelMobile.querySelector('.variant-option').innerHTML = '';

        let content = document.createElement('div');

        let gridEl = document.createElement('div')
        gridEl.className = 'flex'

        let imgEl = document.createElement('img');
        if(imgSrc.search('/?/') > -1) {
            imgSrc = imgSrc.split('?')
            imgSrc = imgSrc[0]
        }
        imgEl.src = imgSrc

        let infoPdp = document.createElement('div')
        infoPdp.className = 'infoPDP';

        infoPdp.innerHTML =  doc.getElementById('content-pdp').querySelector('.info-pdp').innerHTML

        gridEl.appendChild(imgEl)
        gridEl.appendChild(infoPdp)

        content.appendChild(gridEl)

        let actionEl = document.createElement('div')
        actionEl.className = 'action'

        let elBack = document.createElement('div');
        elBack.className = 'btn-back';
        elBack.innerHTML = 'Seleccionar otra';
        elBack.addEventListener('click', function () {
            if(typeProduct == 'simple') {
                modelMobile.classList.remove('active')
                document.querySelector('.product-card-drawer').style.visibility = "hidden";
                modelMobile.querySelector('.variant-color').innerHTML = '';
                modelMobile.querySelector('.variant-option').innerHTML = '';
            } else {
                modelMobile.querySelector('.title').innerHTML = 'Seleccionar producto';
                document.getElementById('model-quick-add-mobile').querySelector('.variant-color').classList.add('active')
                document.getElementById('model-quick-add-mobile').querySelector('.variant-option').classList.remove('active')
            }
        });

        let elAddCart = document.createElement('div');
        elAddCart.className = 'btn-submit-quick-add-cart';
        elAddCart.innerHTML = 'Añadir al carrito <div class="loading__spinner hidden">' +
            '  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="61px" height="61px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n' +
            '    <circle cx="50" cy="50" fill="none" stroke="#000" stroke-width="11" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(220.188 50 50)">\n' +
            '      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>\n' +
            '    </circle>\n' +
            '  </svg></div>';

        elAddCart.addEventListener('click', async function () {
            let selectOption = doc.getElementById('content-pdp').querySelector('#products-select-variants')
            await self.addProductToCartWhenOnlyOption(selectOption);
        })

        actionEl.appendChild(elBack)
        actionEl.appendChild(elAddCart)

        content.appendChild(actionEl)

        modelMobile.querySelector('.variant-option').appendChild(content)
    }

    showError(mess) {
        let elError = document.createElement('div')
        elError.className = 'notification error';
        elError.innerHTML = mess;
        if (this.querySelector('.card_product_class') && !this.querySelector('.add-to-cart-button-class').classList.contains('error')) {
            this.querySelector('.card_product_class').appendChild(elError);
        }
    }

    clearError() {
        if (this.querySelector('.card_product_class').querySelector('.error')) {
            this.querySelector('.card_product_class').querySelector('.error').remove();
        }
    }

    async quickAddCart() {
        let self = this;
        let isChoose = true;
        let titleValue = '';

        if (this.querySelector('.popup-quick-add') &&
            this.querySelector('.popup-quick-add').querySelector('.notification.error')) {
            this.querySelector('.popup-quick-add').querySelector('.notification.error').remove();
        }
        if (document.getElementById('model-quick-add-mobile') &&
            document.getElementById('model-quick-add-mobile').querySelector('.notification.error')) {
            document.getElementById('model-quick-add-mobile').querySelector('.notification.error').remove();
        }

        let optionSelect = this.querySelectorAll('.option-varian-select');
        if(optionSelect.length <= 0 ){
            optionSelect = document.getElementById('model-quick-add-mobile').querySelectorAll('.option-varian-select');
        }

        optionSelect.forEach(option => {
            let optionSelected = option.querySelector('input[type="radio"]:checked');
            if(optionSelected) {
                let value = optionSelected.value;
                titleValue += value;
            } else {
                isChoose = false;
            }
        })

        if (!isChoose || titleValue == '') {
            let elError = document.createElement('div')
            elError.className = 'notification error';
            elError.innerHTML = 'Please choose full option';
            if (window.screen.width > 768) {
                if (this.querySelector('.popup-quick-add')) {
                    this.querySelector('.popup-quick-add').appendChild(elError);
                }
            } else {
                if (document.getElementById('model-quick-add-mobile')) {
                    document.getElementById('model-quick-add-mobile').appendChild(elError);
                }
            }
            return
        }

        titleValue = titleValue.replaceAll(/\s/g, '').replaceAll('/', '').toLocaleLowerCase();
        let typeProduct = this.getAttribute('data-type-product');
        let idVariant = await this.getIdVariantByTitle(titleValue, typeProduct);
        if (idVariant) {
            await self.addToCart(idVariant, this);
        }
    }

    async addToCart(idVariant, self) {
        const config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];
        const formData = new FormData();
        formData.append('id', idVariant);
        if (self.cart) {
            formData.append(
                "sections",
                self.cart.getSectionsToRender().map((section) => section.id)
            );
            formData.append("sections_url", window.location.pathname);
            self.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        let btnAddToCart = this.querySelector('.btn-submit-quick-add-cart') ||  document.getElementById('model-quick-add-mobile').querySelector('.btn-submit-quick-add-cart');
        if(btnAddToCart) {
            btnAddToCart.disabled = true;
            btnAddToCart.setAttribute("aria-disabled",true)
            btnAddToCart.classList.add('loading');
            btnAddToCart.querySelector('.loading__spinner').classList.remove('hidden');
        }
        await fetch(`${routes.cart_add_url}`, config)
            .then((response) => response.json())
            .then((response) => {
                if (response.status) {
                    let elError = document.createElement('div')
                    elError.className = 'notification error';
                    elError.innerHTML = response.description;
                    if (window.screen.width > 768) {
                        if(self.querySelector('.card__content')) {
                            elError.style.paddingTop = '12px';
                            elError.style.paddingLeft = '12px';
                            self.querySelector('.card__content').appendChild(elError);
                        }
                    } else {
                        if (document.getElementById('model-quick-add-mobile')) {
                            document.getElementById('model-quick-add-mobile').appendChild(elError);
                        }
                    }
                    setTimeout(function () {
                        document.querySelectorAll('.notification.error').forEach(item => {
                            item.remove();
                        })
                    },2500)
                    return;
                }
                self.cart.renderContents(response);
                if (window.screen.width > 768) {
                    self.querySelector('.btn-quick-add-cart').setAttribute('data-open', "false")
                } else {
                    document.getElementById('model-quick-add-mobile').classList.remove('active')
                    document.querySelector('.product-card-drawer').style.visibility = "hidden";
                    document.getElementById('model-quick-add-mobile').querySelector('.variant-color').innerHTML = '';
                    document.getElementById('model-quick-add-mobile').querySelector('.variant-option').innerHTML = '';
                }
            }).catch(function (err) {
            }).finally(async () => {
                if(this.querySelector('.add-to-cart-button-class')) {
                    this.querySelector('.add-to-cart-button-class').classList.remove('notshow');
                }
                if(this.querySelector('.popup-quick-add')) {
                    this.querySelector('.popup-quick-add').classList.remove('active');
                }
                if(this.querySelector('.btn-quick-add-cart')) {
                    this.querySelector('.btn-quick-add-cart').setAttribute('data-open', "true");
                }
                if (this.querySelector('.add-to-cart-button-class')) {
                    this.querySelector('.add-to-cart-button-class').classList.remove('notshow');
                }
                if(btnAddToCart) {
                    btnAddToCart.disabled = false;
                    btnAddToCart.setAttribute("aria-disabled", false)
                    btnAddToCart.classList.remove('loading');
                    btnAddToCart.querySelector('.loading__spinner').classList.add('hidden');
                }
            });
    }

    async getIdVariantByTitle(title, typeProduct) {
        let self = this;
        let productIdSelect = null, urlProduct = null;
        if (this.querySelector('.option-varian-1:checked')) {
            productIdSelect = this.querySelector('.option-varian-1:checked').getAttribute('data-product-id');
            urlProduct = this.querySelector('.option-varian-1:checked').getAttribute('data-product-utl');
        }
        if (document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked')) {
            productIdSelect = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-id')
            urlProduct = document.getElementById('model-quick-add-mobile').querySelector('.option-varian-1:checked').getAttribute('data-product-utl')
        }
        let elProduct = this;
        if(typeProduct == 'bundle') {
            elProduct = document.querySelector(`slider-image-card[data-id="${productIdSelect}"]`);
        }

        let option = null;
        if (elProduct) {
            option = elProduct.querySelector('.main_product_form_varaiants_class').querySelectorAll('option');
        } else {
            let doc = await self.getDataVariationProduct(urlProduct)
            option =  doc.getElementById('content-pdp').querySelector('#products-select-variants');
            option = option.querySelectorAll('option');
        }

        let idVarianOption;
        option.forEach(item => {
            let valueOption = item.innerHTML.replaceAll(/\s/g, '').replaceAll('/', '').toLocaleLowerCase();
            if (valueOption == title) {
                idVarianOption = item.getAttribute('value');
                return;
            }
        });
        return idVarianOption;
    }
}
customElements.define('slider-image-card', cardProduct);