import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../api/apiClient';
import '../styles/bookings.css';

const ROOM_TYPES = {
  STANDARD: { name: 'Standard Room', price: 150 },
  DOUBLE: { name: 'Double Room', price: 200 },
  SUITE: { name: 'Suite', price: 300 },
  DELUXE: { name: 'Deluxe Suite', price: 450 }
};

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    roomType: 'STANDARD',
    checkIn: '',
    checkOut: '',
    guests: 2,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const result = await apiCall('/bookings');
      setBookings(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return Math.max(1, days);
    }
    return 1;
  };

  const getTotalPrice = () => {
    const room = ROOM_TYPES[formData.roomType];
    return room.price * calculateDays();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiCall('/bookings', 'POST', {
        ...formData,
        totalPrice: getTotalPrice()
      });

      setSuccess('Booking confirmed successfully!');
      setFormData({
        roomType: 'STANDARD',
        checkIn: '',
        checkOut: '',
        guests: 2,
        specialRequests: ''
      });

      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h2>🏨 My Bookings</h2>

      <div className="booking-section">
        <div className="booking-form-card">
          <h3>Create New Booking</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Room Type:</label>
              <select name="roomType" value={formData.roomType} onChange={handleChange}>
                {Object.entries(ROOM_TYPES).map(([key, room]) => (
                  <option key={key} value={key}>
                    {room.name} - ${room.price}/night
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Check-in Date:</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Check-out Date:</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Guests:</label>
              <input
                type="number"
                name="guests"
                min="1"
                max="6"
                value={formData.guests}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Special Requests (Optional):</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="e.g., High floor, near elevator..."
              ></textarea>
            </div>

            <div className="price-summary">
              <p>
                <strong>${ROOM_TYPES[formData.roomType].price}</strong> x {calculateDays()} nights = 
                <strong className="total"> ${getTotalPrice().toFixed(2)}</strong>
              </p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Book Now'}
            </button>
          </form>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>

        <div className="bookings-list-card">
          <h3>Your Bookings ({bookings.length})</h3>

          {bookings.length === 0 ? (
            <p className="empty">No bookings yet</p>
          ) : (
            <div className="list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-details">
                    <h4>{booking.roomType}</h4>
                    <p>
                      {new Date(booking.checkIn).toLocaleDateString()} - 
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p>Guests: {booking.guests} | Total: ${booking.totalPrice.toFixed(2)}</p>
                  </div>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Bookings;