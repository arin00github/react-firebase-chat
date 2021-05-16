import { useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../../firebase';
import mime from 'mime-types';
import {setPhotoURL} from '../../../redux/actions/user_action';

export default function UserPanel (){

    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch();

    //console.log('UserPanel', user);

    const inputOpenImageRef = useRef();

    const handleLogout = () => {
        firebase.auth().signOut();
    }

    const handleOpenImage = () => {
       inputOpenImageRef.current.click();
    }

    const handleUploadImage = async(event) => {
       const file = event.target.files[0];

       const metadata = {contentType: mime.lookup(file.name)};

       try{
           //스토리지에 파일 저장하기
           let uploadTaskSnapshot = await firebase.storage().ref()
           .child(`user_image/${user.id}`)
           .put(file, metadata)

           let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL()

           //console.log('downloadURL', downloadURL);
           //프로필 이미지 수정
           await firebase.auth().currentUser.updateProfile({
               photoURL: downloadURL
           })
           //리덕스에 이미지 다시 저장
           dispatch(setPhotoURL(downloadURL));

           //데이터베이스에 이미지 업데이트 저장
           await firebase.database().ref('users')
                    .child(user.uid)
                    .update({image: downloadURL})

           
       } catch (err){
            console.log(err)
       }
    }

    return (
        <div>
            <h3 style={{color: 'whtie'}}>
                <IoIosChatboxes />{" "}Chat App;
            </h3>
            <div style={{display: 'flex', marginBottom: '1rem'}}>
                <Image src={user ? user.photoURL : 'holder.js/171x180'}
                style={{width: '30px', height: '30px', marginTop: '3px'}} />
                <Dropdown>
                    <Dropdown.Toggle
                    style={{background: 'transparent', border: '0px'}}
                    id="dropdown-basic"
                    >
                        {user && user.displayName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOpenImage}>프로필 사진변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                        <Dropdown.Item href="/menu03">3menu</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <input
            onChange={handleUploadImage}
            accept="image/jpeg, image/png"
            style={{display: 'none'}}
            ref={inputOpenImageRef}
            type="file" />
        </div>
    )
}