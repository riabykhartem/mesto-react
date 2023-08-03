import "../index.css";
import React, { useEffect } from "react";
import Header from "./header/Header.jsx";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import PopupWithImage from "./popupWithImage/PopupWithImage.jsx";
import api from "../utils/api.js";
import CurrentUserContext from "./contexts/CurrentUserContext.js";
import EditProfilePopup from "./editProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./editAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "./addPlacePopup/AddPlacePopup";
function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [zoomedCard, setZoomedCard] = React.useState({});
  const [isZoomPopupOpen, setZoomedCardOpen] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({});

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
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser({name: data.name, about: data.about, avatar: data.avatar});
      })
      .catch((err) => {
        console.error(`ошибка при установки контекста: ${err}`);
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
      ).catch((err) => `ошибка при нажатии лайка: ${err}`);
    });
  }

  function handleCardDelete(deletedCardId) {
    api
      .deleteCard(deletedCardId)
      .then(
        setInitialCards(
          initialCards.filter((card) => {
            if (card._id === deletedCardId) {
              return null;
            } else {
              return card;
            }
          })
        )
      )
      .catch((err) => console.error(`ошибка при удалении карточки: ${err}`));
  }
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setZoomedCardOpen(false);
  }

  function handleUpdateUser(newUserData) {
    api
      .setUserInfo({name: newUserData.name, about: newUserData.about})
      .then(res => setCurrentUser({name: res.name, about: res.about, avatar: currentUser.avatar}))
      .then(() => closeAllPopups())
      .catch((err) => console.error(`ошибка при редактировании профиля: ${err}`));
  }

  function handleUpdateAvatar(newAvatar) {
    api
      .setAvatar(newAvatar).then(res => setCurrentUser({avatar: res.avatar, name: currentUser.name, about: currentUser.about}))
      .catch((err) => console.error(`ошибка при обновлении автара: ${err}`));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((dataCard) => setInitialCards([dataCard, ...initialCards]))
      .then(closeAllPopups())
      .catch((err) => `ошибка при добавлении новой карточки: ${err}`);
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

        <EditProfilePopup
          isOpened={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        ></EditProfilePopup>

        <EditAvatarPopup
          isOpened={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>

        <AddPlacePopup
          isOpened={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onAddPlace={handleAddPlaceSubmit}
        ></AddPlacePopup>

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
