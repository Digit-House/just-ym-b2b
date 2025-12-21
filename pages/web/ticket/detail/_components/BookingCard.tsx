function BookingCard() {
    return (
      <div className="bg-white rounded-xl p-6 shadow space-y-4">
        <h3 className="font-semibold">Book Ticket</h3>
  
        <select className="w-full border rounded-lg px-3 py-2 text-sm">
          <option>Safari Park Only</option>
          <option>Safari + Marine Park</option>
          <option>Safari + Marine + Lunch</option>
        </select>
  
        <Counter label="Adult (12 yrs & Above)" price="THB 650" />
        <Counter label="Child (2–12 yrs)" price="THB 0" />
  
        <div className="flex justify-between font-semibold pt-4">
          <span>Total Payment</span>
          <span className="text-indigo-600">฿ 2800</span>
        </div>
  
        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm">
            Next
          </button>
          <button className="flex-1 bg-indigo-200 text-indigo-700 rounded-lg py-2 text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
  
  function Counter({ label, price }) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-gray-500">{price}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full bg-gray-100">−</button>
          <span>1</span>
          <button className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
            +
          </button>
        </div>
      </div>
    );
  }
  
export default BookingCard;  