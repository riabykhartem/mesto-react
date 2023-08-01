import "../index.css";
import React, { useEffect } from "react";
import Header from "./header/Header.jsx";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import PopupWithImage from "./popupWithImage/PopupWithImage.jsx";
import api from "../utils/api.js";
import CurrentUserContext from "./contexts/CurrentUserContext.js";
import EditProfilePopup from './editProfilePopup/EditProfilePopup'
function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [zoomedCard, setZoomedCard] = React.useState({});
  const [isZoomPopupOpen, setZoomedCardOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState("");

  const [initialCards, setInitialCards] = React.useState([]);

  useEffect(() => {
    api
      .getInitialCards()
      .then((dataCard) => {
        setInitialCards(dataCard);
      })
      .catch((err) => console.error(`ошибка при рендере карточки: ${err}`));
  }, []);

  useEffect(() => {
    api.getUserInfo().then((data) => {
      setCurrentUser(data);
    });
  }, []);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleCardClick(card) {
    setZoomedCard(card);
    setZoomedCardOpen(true);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setInitialCards((initialCards) =>
        initialCards.map((c) => (c._id === card._id ? newCard : c))
      );
    });
  }

  function handleCardDelete(deletedCardId) {
    api
      .deleteCard(deletedCardId)
      .then(
        setInitialCards(
          initialCards.filter((card) => {
            if (card._id === deletedCardId) {
              return null
            } else {
              return card;
            }
          })
        )
      )
      .catch((err) => console.log(`ошибка при удалении карточки: ${err}`));
  }
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setZoomedCardOpen(false);
  }

  function handleUpdateUser(){
    console.log(currentUser.name); //выводится новое имя
    api.setUserInfo({name: currentUser.name, description: currentUser.description})
    .then(console.log("данные улетели на сервер"))
    .then(closeAllPopups())
    .catch(err => `ошибка при редактировании профиля: ${err}`)
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__container">
        <Header />

        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlaceClick={handleAddPlaceClick}
          onCardClick={handleCardClick}
          initialCards={initialCards}
          onLike={handleCardLike}
          onDelete={handleCardDelete}
        />

        <Footer />

        <EditProfilePopup isOpened={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}></EditProfilePopup>

        <PopupWithForm
          isOpened={isAddPlacePopupOpen}
          name="add-card"
          title="Новое место"
          submitButtonValue="Создать"
          onClose={closeAllPopups}
        >
          <input
            required
            name="name"
            minLength="2"
            maxLength="30"
            type="text"
            placeholder="Название"
            id="input-card-name"
            className="form__input form__input_type_avatar"
          />
          <span className="error" id="input-card-name-error"></span>
          <input
            required
            name="link"
            type="url"
            placeholder="Ссылка на картинку"
            id="input-card-url"
            className="form__input form__input_type_url"
          />
          <span className="error" id="input-card-url-error"></span>
        </PopupWithForm>

        <PopupWithForm
          name="avatar"
          title="Обновить аватар"
          submitButtonValue="Cохранить"
          isOpened={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        >
          <input
            required
            name="avatar"
            type="url"
            placeholder="Ссылка на картинку"
            id="input-avatar"
            className="form__input form__input_type_url"
          />
          <span className="error" id="input-avatar-error"></span>
        </PopupWithForm>

        <PopupWithForm
          name="delete-card"
          title="Редактировать профиль"
          submitButtonValue="Да"
        />

        <PopupWithImage
          card={zoomedCard}
          isOpened={isZoomPopupOpen}
          onCardClick={handleCardClick}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
