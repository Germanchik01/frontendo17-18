document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesContainer = document.getElementById('notes-container');
    const offlineStatus = document.getElementById('offline-status');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    let isEditing = false;
    let currentEditIndex = null;
    
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineStatus.classList.add('hidden');
        } else {
            offlineStatus.classList.remove('hidden');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        renderNotes(notes);
    }
    
    function renderNotes(notes) {
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p class="no-notes">У вас пока нет заметок</p>';
            return;
        }
        
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            
            noteElement.innerHTML = `
                <div class="note-content">${note.text}</div>
                <div class="note-actions">
                    <button class="edit-btn" data-index="${index}" title="Редактировать">Редактировать</button>
                    <button class="delete-btn" data-index="${index}" title="Удалить">Удалить</button>
                </div>
            `;
            
            notesContainer.appendChild(noteElement);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteNote(index);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                startEditingNote(index);
            });
        });
    }
    
    function addNote() {
        const text = noteInput.value.trim();
        if (!text) return;
        
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        
        if (isEditing) {
            notes[currentEditIndex].text = text;
            notes[currentEditIndex].updatedAt = Date.now();
            isEditing = false;
            currentEditIndex = null;
            addNoteBtn.textContent = 'Добавить заметку';
            cancelEditBtn.classList.add('hidden');
        } else {
            notes.push({ 
                text, 
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }
        
        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes(notes);
    }
    
    function startEditingNote(index) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        noteInput.value = notes[index].text;
        noteInput.focus();
        
        isEditing = true;
        currentEditIndex = index;
        addNoteBtn.textContent = 'Сохранить изменения';
        cancelEditBtn.classList.remove('hidden');
    }
    
    function deleteNote(index) {
        if (!confirm('Вы уверены, что хотите удалить эту заметку?')) return;
        
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes(notes);
        
        if (isEditing && currentEditIndex == index) {
            cancelEditing();
        }
    }
    
    function cancelEditing() {
        isEditing = false;
        currentEditIndex = null;
        noteInput.value = '';
        addNoteBtn.textContent = 'Добавить заметку';
        cancelEditBtn.classList.add('hidden');
    }
    
    addNoteBtn.addEventListener('click', addNote);
    cancelEditBtn.addEventListener('click', cancelEditing);
    
    loadNotes();
});