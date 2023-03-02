function test(){
    console.log('test')
  }
  function changeQty(productid, count) {
    let quantity = parseInt(document.getElementById(productid).innerHTML)
    count = parseInt(count)
    $.ajax({
      url: '/changeqty',
      data: {
        product: productid,
        count: count

      },
      method: 'post',
      success: (response) => {
        document.getElementById(productid).innerHTML = quantity + count
      }
    })
  }


  document.getElementById('addQuantity').addEventListener('click',()=>{
    console.log('hello')
  })