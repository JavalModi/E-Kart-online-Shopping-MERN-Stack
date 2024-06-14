import React, { useEffect, useState } from 'react'
import './ListProduct'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {

  const [allproducts,setAllproducts] = useState([])

  const fetchInfo = async ()=>{
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllproducts(data)})
  }

  useEffect(()=>{
    fetchInfo()
  },[])

  const remove_product = async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo()
  }

  return (
    <div className='list-product' style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",height:"auto",padding:"10px 50px",margin:"30px",borderRadius:"6px",background:"white"}}>
      <h1>All Product List</h1>
      <div className="listproduct-format-main" style={{display:"grid",gridTemplateColumns:"1fr 3fr 1fr 1fr 1fr 1fr",gap:"10px",width:"100%",padding:"20px 0px",color:"#454545",fontSize:"15px",fontWeight:"600"}}>
        <p>Products</p>
        <p>Title</p>
        <p>Old_price</p>
        <p>New_price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          return <> <div key={index} className="listproduct-format-main listproduct-format"style={{display:"grid",gridTemplateColumns:"1fr 3fr 1fr 1fr 1fr 1fr",gap:"10px",width:"100%",padding:"20px 0px",color:"#454545",fontSize:"15px",fontWeight:"600",alignItems:"center",fontWeight:"500"}}>
              <img src={product.image} className='listproduct-product-icon' style={{height:'80px'}} alt="" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} src={cross_icon} className='listproduct-remove-icon' style={{cursor:"pointer",margin:"auto"}} alt="" />
          </div>
          <hr /></>
        })}
      </div>
    </div>
  )
}

export default ListProduct
