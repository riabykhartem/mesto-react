export default function Card(props) {
  return (
    <li className="element">
      <img
        src={props.link}
        alt={props.name}
        className="element__photo"
        onClick={() => props.onCardClick({link: props.link, name: props.name})}
      />
      <button className="button element__trash-button" />
      <div className="element__footer">
        <h2 className="element__name">{props.name}</h2>
        <div className="element__likes-container">
          <button
            type="button"
            aria-label="like"
            className="button element__like-button"
          />
          <span className="element__likes-counter">{props.likes.length}</span>
        </div>
      </div>
    </li>
  );
}
