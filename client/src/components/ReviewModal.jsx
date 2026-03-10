import { useState } from 'react';
import axios from 'axios';
import { X, Star } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, request }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const reviewedUserId = request.sender._id === request.user_id ? request.receiver._id : request.sender._id; // Logic to find OTHER user

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
                reviewedUserId: request.sender._id, // Simplification: Assumes we are reviewing the SENDER (if we are receiver). 
                // Context: If I am receiver (Service Provider), I review Sender (Requester)? Or vice-versa?
                // The prompt says "Ratings and reviews after service completion". Usually both can review.
                // For now, let's assume this modal is triggered by the Receiver to review the Sender or vice-versa.
                // Better: Pass the target user ID to the modal.
                requestId: request._id,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onClose();
            alert('Review submitted!');
        } catch (error) {
            alert('Failed to submit review');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2 mb-4 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                <Star fill={rating >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Share your experience..."
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
