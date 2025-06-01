import React from 'react';
import './componentsStyle/TeamEditorModal.css';

function TeamEditorModal({ team, admins, onClose, onToggleAdmin, onRemoveMember }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Редагувати команду</h3>
        <ul>
          {team.map(member => (
            <li key={member}>
              <span>{member}</span>
              <div>
                <button onClick={() => onToggleAdmin(member)}>
                  {admins.includes(member) ? 'Зняти адміна' : 'Призначити адміном'}
                </button>
                <button onClick={() => onRemoveMember(member)}>
  Видалити
</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
}

export default TeamEditorModal;
