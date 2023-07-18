import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Card from "../card/Card.jsx";

export default function Main(props) {
  const [userName, setUserName] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [initialCard, setInitialCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getInfo(), api.getInitialCards()])
      .then(([dataUser, dataCard]) => {
        setUserName(dataUser.name);
        setUserDescription(dataUser.about);
        setUserAvatar(dataUser.avatar);

        dataCard.forEach((element) => {
          element.myId = dataUser._id;
        });
        setInitialCards(dataCard);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main>
      <section className="profile section">
        <div className="profile__container">
          <button
            type="button"
            className="profile__avatar-button"
            onClick={props.onEditAvatar}
          >
            <img src={userAvatar} alt="аватар" className="profile__avatar" />
          </button>
          <div className="profile__info">
            <h1 className="profile__name">{userName}</h1>
            <p className="profile__description">{userDescription}</p>
            <button
              type="button"
              aria-label="edit"
              className="button profile__edit-button"
              onClick={props.onEditProfile}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="add"
          className="button profile__add-button"
          onClick={props.onAddPlaceClick}
        />
      </section>
      <section className="elements section">
        <template className="template" />
        <ul className="elements__list">
          {initialCard.map((data) => {
            return (
              <Card
                name={data.name}
                link={data.link}
                key={data._id}
                onCardClick={props.onCardClick}
                likes={data.likes}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}
