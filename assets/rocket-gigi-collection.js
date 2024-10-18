document.addEventListener('DOMContentLoaded', function() {
  new Ajaxinate({
    container: '#product-grid',
    pagination: '#AjaxinatePagination',
    offset: 0,
    callback: function() {
      // Callback function
    }
  });
  document.addEventListener('ajaxinate:load', function() {
    console.log('Ajaxinate loaded');
  })
} );