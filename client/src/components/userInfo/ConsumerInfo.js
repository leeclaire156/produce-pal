import React, { useState } from 'react';
import './userInfo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMedal, faCamera } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap';
import 'react-bootstrap';
import axios from 'axios';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_IMAGE } from '../../utils/mutations';
import { QUERY_USERS, GET_IMAGE } from '../../utils/queries';
// import ConsumerEditModal from './ConsumerEditModal';

function ConsumerInfo(props) {

    const [showCamera, setShowCamera] = useState(false);

    const handleProfileImageMouseEnter = () => {
        setShowCamera(true);
    };

    const handleProfileImageMouseLeave = () => {
        setShowCamera(false);
    };


    const [newuserUrl, setUserUrl] = useState("");
    const [updateUserImage] = useMutation(UPDATE_USER_IMAGE);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    function uploadSingleImage(base64) {
        axios
            .post("http://localhost:3000/uploadImage", { image: base64 })

            .then((res) => {
                // trigger refetch function in here
                const uploadUrl = res.data
                // setUserUrl(uploadUrl);
                updateUserImage({
                    variables: {
                        user: props._id,
                        userImage: uploadUrl
                    }, refetchQueries:[{query: GET_IMAGE}]
                })
                // alert(`User Image uploaded Successfully.`);
                // window.location.reload(false);
            })
            .catch(console.log);
    }

    const uploadImage = async (event) => {
        const files = event.target.files;
        const base64 = await convertBase64(files[0]);
        uploadSingleImage(base64);
    };

    return (
        <div className="container-fluid">
            <div className="toggle-container text-end">

            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#consumerModal">
                    Edit
                </button>
                {/* {props.vendorStatus ?
                    <button className="btn btn-primary visually-hidden">
                        Hidden
                    </button> : <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#consumerModal">
                        Edit
                    </button>} */}

            </div>
            <div className="row">
                <div className="col-12 text-center mb-5">
                    <h1>{props.firstName} {props.lastName}</h1>
                </div>
            </div>
            <div className="row align-items-center">



                <label className="col-md-6 profile-image"
                    onMouseEnter={handleProfileImageMouseEnter}
                    onMouseLeave={handleProfileImageMouseLeave}
                >
                    <img
                        src={props.userImage ? props.userImage : "https://placehold.co/600x600"}
                        alt=""
                        className="img-fluid "
                        height={600}
                        width={600}
                    />
                    {!props.vendorStatus && showCamera && (
                        <div className="camera-overlay">
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                    )}

                    <input name='userImage' type="file" onChange={uploadImage} id={props.userImage} hidden></input>


                </label>







                <div className="col-md-6">
                    <div className="">
                        <div className="">
                            <h3>About</h3>
                        </div>
                        <div className="">
                            <p>{props.biography}</p>
                        </div>

                        <div className="mt-5">
                            <div className="row">
                                <div className="col-lg-2 col-md-2"><FontAwesomeIcon icon={faUser} size="3x" /></div>
                                <div className="col-lg-10 col-md-10">
                                    <h5>Address</h5>
                                    <p>{props.address[0]?.street}, {props.address[0]?.city}, {props.address[0]?.state}, {props.address[0]?.zipcode}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2 col-md-2"><FontAwesomeIcon icon={faPhone} size="3x" /></div>
                                <div className="col-lg-10 col-md-10">
                                    <h5>Contact</h5>
                                    <p>{props.phone}, {props.email}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-2 col-md-2"><FontAwesomeIcon icon={faMedal} size="3x" /></div>
                                <div className="col-lg-10 col-md-10">
                                    <h5>Memberships</h5>
                                    <p>{props.memberships}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Edit consumer profile Modal --> */}
            <div className="modal fade" id="consumerModal" tabIndex="-1" aria-labelledby="consumerModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="consumerModalLabel">Edit my profile</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" className="form-control text-muted" id="first-name-input" defaultValue={props.firstName} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" className="form-control text-muted" id="full-name-input" defaultValue={props.lastName} />
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label>Street</label>
                                    <input type="text" className="form-control text-muted" id="street-input" defaultValue={props.address[0]?.street} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>City</label>
                                    <input type="text" className="form-control text-muted" id="city-input" defaultValue={props.address[0]?.city} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>State</label>
                                    <input type="text" className="form-control text-muted" id="state-input" defaultValue={props.address[0]?.state} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Zipcode</label>
                                    <input type="text" className="form-control text-muted" id="zipcode-input" defaultValue={props.address[0]?.zipcode} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" className="form-control text-muted" id="phone-input" defaultValue={props.phone} />
                            </div>
                            {/* <div className="form-group">
                                <label>Memberships</label>
                                <input type="text" className="form-control text-muted" id="membership-input" defaultValue={props.memberships} />
                            </div> */}
                            <div className="form-group">
                                <label>Biography</label>
                                <textarea className="form-control text-muted" id="description-input" rows="5" defaultValue={props.biography}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ConsumerInfo;
