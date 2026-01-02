<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products?.slice(0, 8).map((item) => (
    <Link to={`/product/${item._id}`} key={item._id}>
      <div className="bg-white/5 border border-white/10 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 overflow-hidden backdrop-blur-sm">
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-blue-300 font-bold mt-1">₹{item.price}</p>
        </div>
      </div>
    </Link>
  ))}
</div>
