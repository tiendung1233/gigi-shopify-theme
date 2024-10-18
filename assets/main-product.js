const handleSelectRecommendations = () => {
  const customSelect = document.querySelector('.product-main-sticky-recommendations .sticky-select');

  if (customSelect) {
    customSelect.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }
}
handleSelectRecommendations()

const handleStickyButton = () => {
  window.addEventListener('scroll', function() {
    const mainProductForm = document.querySelector('.main-product-form');
    const mainProductFormSticky = document.querySelector('.main-product-sticky-form');

    if (mainProductForm && mainProductFormSticky) {
      const mainProductFormRect = mainProductForm.getBoundingClientRect();
      if (mainProductFormRect.bottom < 0) {
        mainProductFormSticky.classList.add('active');
      } else {
        mainProductFormSticky.classList.remove('active');
      }
    }
  });
}
handleStickyButton();

(function() {
  /**
   * Class representing a ProductAccordion.
   */
  class ProductAccordion {
    /**
     * Create a ProductAccordion.
     */
    constructor() {
      this.level1Links = document.querySelectorAll('.accordion__navigation .collapsible_tab-title');
      this.level2 = document.querySelectorAll('.collapsible_tab-body');
      this.activeClass = 'active';
      this.bindEvents();
    }

    /**
     * Bind click events to item links.
     */
    bindEvents() {
      this.level1Links.forEach((link, indexLevel1) => {
        link.addEventListener('click', () => this.handleLevel1Click(link, indexLevel1));
      });
    }

    /**
     * Handle click event for level 1 item links.
     * @param {HTMLElement} link - The clicked link element.
     * @param {number} indexLevel1 - The index of the clicked link in the level 1 links.
     */
    handleLevel1Click(link, indexLevel1) {
      this.level1Links.forEach(otherLink => {
        if (otherLink !== link) {
          otherLink.classList.remove(this.activeClass);
        }
      });
      link.classList.add(this.activeClass);

      this.level2.forEach((subItem, indexLevel2)=> {
        subItem.classList.toggle(this.activeClass, indexLevel1 === indexLevel2);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ProductAccordion();
  });
})();
