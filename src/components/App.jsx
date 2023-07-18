import "../index.css";
import React from "react";
import Header from "./header/Header.jsx";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import PopupWithImage from "./popupWithImage/PopupWithImage.jsx";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [zoomedCard, setZoomedCard] = React.useState({});
  const [isZoomPopupOpen, setZoomedCardOpen] = React.useState(false);

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

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setZoomedCardOpen(false);
  }

  return (
    <div className="page__container">
      <Header />

      <Main
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlaceClick={handleAddPlaceClick}
        onCardClick={handleCardClick}
      />

      <Footer />

      <PopupWithForm
        name="profile"
        title="Редактировать профиль"
        closeButton=""
        submitButtonValue="Cохранить"
        isOpened={isEditProfilePopupOpen}
        onClose={closeAllPopups}
      >
        <input
          required
          minLength={2}
          maxLength={40}
          type="text"
          name="name"
          placeholder="Имя"
          id="input-profile-name"
          className="form__input form__input_type_name"
        />
        <span className="error" id="input-profile-name-error" />
        <input
          required
          minLength={2}
          maxLength={200}
          type="text"
          name="description"
          placeholder="О себе"
          id="input-profile-description"
          className="form__input form__input_type_description"
        />
        <span className="error" id="input-profile-description-error" />
      </PopupWithForm>

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
  );
}

export default App;
