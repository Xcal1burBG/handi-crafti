import { ImageUnit } from '../ImageUnit/ImageUnit';
import './Details.css';
import { useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import { offerServiceFactory } from '../../services/offerService';
import { reviewServiceFactory } from '../../services/reviewService';
import { OfferContext } from '../../Contexts/OfferContext';
import { baseUrl } from '../../config/config';

export const Details = () => {

    const { offerId } = useParams();
    const [offer, setOffer] = useState({});
    const auth = useContext(AuthContext);
    const offerService = offerServiceFactory(auth.token);
    const reviewService = reviewServiceFactory(auth.token);
    const { token, userId, username, isAuthenticated, userEmail } = useContext(AuthContext);


    console.log(offer);
    useEffect(() => {
        Promise.all([offerService.getById(offerId), reviewService.getAllReviewsOfHandiCrafter(offerId)])
            .then(([offer, reviews]) => {
                const offerState = {
                    ...offer,
                    reviews,
                };
                setOffer(offerState);
            }
            );
    }, [offerId]);

    const onReviewSubmit = async (values) => {
        const response = await reviewService.create(offer.handiCrafterId, values.review);

        setOffer((state) => ({
            ...state,
            reviews: [
                ...state.reviews,
                {
                    ...response,
                    reviews: {
                        username
                    },
                },
            ],
        }));
    };


    const isOwner = offer.handiCrafterId === userId;


    return (



        <div className="details">

            <div className="details-offer-text-container">
                <p className="details-title">{offer.title}</p>


                <p className="details-description"> {offer.description} </p>

                <div className="details-user-contacts-container">

                    <p className="details-username">User: {offer.handiCraftersUsername}</p>
                    <p className="details-contacts">Contact with user:</p>
                    <p className="details-phone">Phone: {offer.phoneNumber}</p>
                    <p className="details-email">Email: {offer.email}</p>
                </div>

                {/* <p className="details-rating">Rating: 9.8</p> */}
            </div>

            <div className="details-all-images-container">
                <ImageUnit />
                <ImageUnit />
                <ImageUnit />
                <ImageUnit />
                <ImageUnit />
                <ImageUnit />
                <ImageUnit />

            </div>


            <div className="details-buttons-container">

                <Link to={`/reviews/post/${offer.handiCrafterId}`}>Leave a review</Link>
                <Link to={`/reviews/offer/${offerId}`} >View all reviews</Link>


                {/* <div className="details-add-photo-container">
                    <label className="details-label-photo" htmlFor="photo">Add photo</label>
                    <input className="details-add-photo" type="text" name="photo"/>
                </div> */}

                {isOwner && (
                    <>
                        <Link to={`/offers/edit/${offer.id}`} className="editBtn">
                            <button className="details-edit-submit" >Edit</button>
                        </Link>

                        <Link to={`/offers/delete/${offer.id}`} className="deleteBtn">
                            <button className="delete-submit" type="submit">Delete</button>
                        </Link>
                    </>

                )}

            </div >


        </div >

    )

}