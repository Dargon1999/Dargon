let isAdmin = false;
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            alert('IndexedDB не поддерживается в этом браузере. Используйте Chrome, Firefox или Edge.');
            reject('IndexedDB не поддерживается');
            return;
        }

        const request = indexedDB.open('FamilyDargonDB', 2);

        request.onupgradeneeded = (event) => {
            console.log('Инициализация базы данных...');
            db = event.target.result;
            if (!db.objectStoreNames.contains('media')) {
                db.createObjectStore('media', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('events')) {
                db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('teamMembers')) {
                db.createObjectStore('teamMembers', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            console.log('База данных открыта');
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('Ошибка базы данных:', event.target.error);
            alert('Ошибка базы данных. Перезагрузите страницу.');
            reject('Ошибка базы данных: ' + event.target.error);
        };

        request.onblocked = () => {
            console.error('База данных заблокирована.');
            alert('База данных заблокирована. Закройте другие вкладки.');
            reject('База данных заблокирована');
        };
    });
}

const defaultMedia = [
    { type: 'img', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEgYL//2P9PAAAygAwdjfsWYAAAAASUVORK5CYII=' },
    { type: 'img', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
    { type: 'video', src: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAdteWxsb2dtZXRhAAACYXRyYWsAAAABAAAAAAAdAAAABwAAP+4QJZAAAAAAMqARoAABQAAAYO8AAAAAABIAAAAAAAAAACRgAAAAAEAAB4nGZS0' },
    { type: 'img', src: 'https://i.postimg.cc/3wMNPx1S/Grand-Theft-Auto-V-Screenshot-2025-02-24-03-07-34-46.png' },
    { type: 'img', src: 'https://i.postimg.cc/4dsdx2rp/20241025180304-1.jpg' },
    { type: 'img', src: 'https://i.postimg.cc/pL5yGFf5/Grand-Theft-Auto-V-Screenshot-2025-02-24-03-08-11-77.png' },
    { type: 'img', src: 'https://i.postimg.cc/ydjNgXHt/Grand-Theft-Auto-V-Screenshot-2025-02-28-15-02-35-38.png' },
    { type: 'img', src: 'https://i.postimg.cc/0jNypM5Q/imagge.png' },
    { type: 'img', src: 'https://i.postimg.cc/fTrJfK9h/imakge.png' },
    { type: 'img', src: 'https://i.postimg.cc/TYwKbSh9/imayye.png' },
    { type: 'img', src: 'https://i.postimg.cc/5twy1Wkx/imhage.png' },
    { type: 'img', src: 'https://i.postimg.cc/c1TKrZ1C/imkage.png' },
    { type: 'img', src: 'https://i.postimg.cc/x8sq7GpM/inmage.png' },
    { type: 'img', src: 'https://i.postimg.cc/HL2mBYh7/20240919231716-1.png' },
    { type: 'img', src: 'https://i.postimg.cc/jSytnQ6c/image.png' },
    { type: 'img', src: 'https://i.postimg.cc/HLHHwcBg/ima-ge.png' },
    { type: 'img', src: 'https://i.postimg.cc/6q7NWd5d/2880-x-1800-game-background-for-GTA-5-RP.jpg' },
    { type: 'img', src: 'https://i.postimg.cc/1XL1fffb/Denis-Dargon-Dargon.png' },
    { type: 'img', src: 'https://i.postimg.cc/MZ4Ssrdt/image.png' },
    { type: 'img', src: 'https://i.postimg.cc/Vk9Pks1H/image.jpg' },
    { type: 'img', src: 'https://i.postimg.cc/J4kWScF8/image1.png' },
    { type: 'img', src: 'https://i.postimg.cc/t4GHbn0x/Leonardo-Viki-Dargon.png' },
    { type: 'img', src: 'https://i.postimg.cc/6QYsCH8r/Satoru-Dargon-Trener.png' },
    { type: 'img', src: 'https://i.postimg.cc/VNYQryks/5-3000px-x-2000px-AI-EPS-JPG.jpg' }
];

const defaultEvents = [
    { title: 'Первая победа клана', date: '1 марта 2025', description: 'Мы одержали первую крупную победу в турнире!' },
    { title: 'Набор новичков', date: '5 марта 2025', description: 'Открыт набор новых членов в семью.' }
];

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginStatus = document.getElementById('loginStatus');

    if (username === 'admin' && password === 'admin123') {
        isAdmin = true;
        loginStatus.textContent = 'Вход выполнен как администратор!';
        document.getElementById('adminControls') && (document.getElementById('adminControls').style.display = 'block');
        document.getElementById('adminEventControls') && (document.getElementById('adminEventControls').style.display = 'block');
        closeLoginModal();
        loadGallery();
        loadEvents();
        loadTeamMembers();
    } else if (username === 'user' && password === 'user123') {
        isAdmin = false;
        loginStatus.textContent = 'Вход выполнен как пользователь!';
        document.getElementById('adminControls') && (document.getElementById('adminControls').style.display = 'none');
        document.getElementById('adminEventControls') && (document.getElementById('adminEventControls').style.display = 'none');
        closeLoginModal();
        loadGallery();
        loadEvents();
        loadTeamMembers();
    } else {
        loginStatus.textContent = 'Неверный логин или пароль!';
    }
}

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    initDB().then(() => {
        const transaction = db.transaction(['media'], 'readonly');
        const store = transaction.objectStore('media');
        const request = store.getAll();

        request.onsuccess = (event) => {
            let mediaArray = event.target.result;
            if (mediaArray.length === 0) {
                const tx = db.transaction(['media'], 'readwrite');
                const store = tx.objectStore('media');
                defaultMedia.forEach(media => store.add(media));
                tx.oncomplete = () => loadGallery();
                return;
            }

            galleryGrid.innerHTML = '';
            mediaArray.forEach((media, index) => {
                const mediaElement = document.createElement(media.type === 'img' ? 'img' : 'video');
                mediaElement.src = media.src;
                mediaElement.className = 'gallery-item';
                if (media.type === 'video') {
                    mediaElement.controls = true;
                    mediaElement.loop = false;
                }
                mediaElement.onclick = () => openFullscreen(media.src);
                const div = document.createElement('div');
                div.className = 'gallery-item-container';
                div.appendChild(mediaElement);

                if (isAdmin) {
                    const deleteBtn = document.createElement('span');
                    deleteBtn.textContent = '×';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteMedia(media.id);
                    };
                    div.appendChild(deleteBtn);
                }

                galleryGrid.appendChild(div);
            });
        };

        request.onerror = () => console.error('Ошибка загрузки галереи');
    }).catch(error => console.error('Ошибка базы данных в loadGallery:', error));
}

function openFullscreen(src) {
    const fullscreenImage = document.getElementById('fullscreenImage');
    const fullscreenModal = document.getElementById('fullscreenModal');
    fullscreenImage.src = src;
    fullscreenModal.style.display = 'flex';
    document.querySelector('.overlay').style.display = 'block';
}

function closeFullscreenModal() {
    const fullscreenModal = document.getElementById('fullscreenModal');
    fullscreenModal.style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

function addMedia() {
    if (!isAdmin) {
        alert('Только администратор может добавлять медиа!');
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSizeMB = 50;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                alert(`Файл слишком большой! Максимальный размер: ${maxSizeMB} МБ.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                initDB().then(() => {
                    const transaction = db.transaction(['media'], 'readwrite');
                    const store = transaction.objectStore('media');
                    store.add({ type: file.type.startsWith('image') ? 'img' : 'video', src: event.target.result });
                    transaction.oncomplete = () => loadGallery();
                });
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function deleteMedia(id) {
    if (!isAdmin) {
        alert('Только администратор может удалять медиа!');
        return;
    }
    initDB().then(() => {
        const transaction = db.transaction(['media'], 'readwrite');
        const store = transaction.objectStore('media');
        store.delete(id);
        transaction.oncomplete = () => loadGallery();
    });
}

function showClearConfirmation() {
    if (!isAdmin) {
        alert('Только администратор может очистить галерею!');
        return;
    }
    const modal = document.getElementById('clearConfirmationModal');
    if (modal) {
        modal.style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeClearConfirmation() {
    const modal = document.getElementById('clearConfirmationModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function confirmClearGallery() {
    if (!isAdmin) return;
    initDB().then(() => {
        const transaction = db.transaction(['media'], 'readwrite');
        const store = transaction.objectStore('media');
        store.clear();
        transaction.oncomplete = () => loadGallery();
    });
    closeClearConfirmation();
}

function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    initDB().then(() => {
        const transaction = db.transaction(['events'], 'readonly');
        const store = transaction.objectStore('events');
        const request = store.getAll();

        request.onsuccess = (event) => {
            let eventsArray = event.target.result;
            if (eventsArray.length === 0) {
                const tx = db.transaction(['events'], 'readwrite');
                const store = tx.objectStore('events');
                defaultEvents.forEach(event => store.add(event));
                tx.oncomplete = () => loadEvents();
                return;
            }

            eventsGrid.innerHTML = '';
            eventsArray.forEach((event) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                eventElement.innerHTML = `
                    <h3>${event.title}</h3>
                    <p><strong>${event.date}:</strong> ${event.description}</p>
                `;
                if (isAdmin) {
                    const editBtn = document.createElement('button');
                    editBtn.textContent = '✎';
                    editBtn.className = 'edit-btn';
                    editBtn.onclick = () => showEditEventForm(event.id, event.title, event.date, event.description);
                    eventElement.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '×';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.onclick = () => deleteEvent(event.id);
                    eventElement.appendChild(deleteBtn);
                }
                eventsGrid.appendChild(eventElement);
            });
        };

        request.onerror = () => console.error('Ошибка загрузки событий');
    }).catch(error => console.error('Ошибка базы данных в loadEvents:', error));
}

function showAddEventForm() {
    if (!isAdmin) {
        alert('Только администратор может добавлять события!');
        return;
    }
    const modal = document.getElementById('addEventModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;

    if (!title || !date || !description) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    initDB().then(() => {
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        store.add({ title, date, description });
        transaction.oncomplete = () => {
            loadEvents();
            closeAddEventModal();
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventDate').value = '';
            document.getElementById('eventDescription').value = '';
        };
    });
}

let currentEventId;
function showEditEventForm(id, title, date, description) {
    currentEventId = id;
    document.getElementById('editEventTitle').value = title;
    document.getElementById('editEventDate').value = date;
    document.getElementById('editEventDescription').value = description;

    const modal = document.getElementById('editEventModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeEditEventModal() {
    const modal = document.getElementById('editEventModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function updateEvent() {
    const title = document.getElementById('editEventTitle').value;
    const date = document.getElementById('editEventDate').value;
    const description = document.getElementById('editEventDescription').value;

    if (!title || !date || !description) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    initDB().then(() => {
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        store.put({ id: currentEventId, title, date, description });
        transaction.oncomplete = () => {
            loadEvents();
            closeEditEventModal();
        };
    });
}

function deleteEvent(id) {
    if (!isAdmin) {
        alert('Только администратор может удалять события!');
        return;
    }
    initDB().then(() => {
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        store.delete(id);
        transaction.oncomplete = () => loadEvents();
    });
}

function showClearEventsConfirmation() {
    if (!isAdmin) {
        alert('Только администратор может очистить события!');
        return;
    }
    const modal = document.getElementById('clearEventsConfirmationModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeClearEventsConfirmation() {
    const modal = document.getElementById('clearEventsConfirmationModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function confirmClearEvents() {
    if (!isAdmin) return;
    initDB().then(() => {
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        store.clear();
        transaction.oncomplete = () => loadEvents();
    });
    closeClearEventsConfirmation();
}

function loadTeamMembers() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    initDB().then(() => {
        const transaction = db.transaction(['teamMembers'], 'readonly');
        const store = transaction.objectStore('teamMembers');
        const request = store.getAll();

        request.onsuccess = (event) => {
            const membersArray = event.target.result;
            teamGrid.innerHTML = membersArray.length === 0 ? '<p>Пока нет дополнительных членов команды.</p>' : '';

            membersArray.forEach((member) => {
                const memberElement = document.createElement('div');
                memberElement.className = 'team-member';
                memberElement.innerHTML = `
                    <img src="${member.photo}" alt="${member.name}" class="member-photo">
                    <h3 class="name">${member.name}</h3>
                    <p class="role">${member.quote}</p>
                `;
                if (isAdmin) {
                    const editBtn = document.createElement('button');
                    editBtn.textContent = '✎';
                    editBtn.className = 'edit-btn';
                    editBtn.onclick = () => showEditMemberForm(member.id, member.name, member.photo, member.quote);
                    memberElement.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '×';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.onclick = () => deleteMember(member.id);
                    memberElement.appendChild(deleteBtn);
                }
                teamGrid.appendChild(memberElement);
            });
        };

        request.onerror = () => console.error('Ошибка загрузки состава:', event.target.error);
    }).catch(error => console.error('Ошибка базы данных в loadTeamMembers:', error));
}

function showAddMemberForm() {
    if (!isAdmin) {
        alert('Только администратор может добавлять членов!');
        return;
    }
    const modal = document.getElementById('addMemberModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeAddMemberModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function addMember() {
    const name = document.getElementById('memberName').value;
    const photoInput = document.getElementById('memberPhoto');
    const quote = document.getElementById('memberQuote').value;

    if (!name || !photoInput.files[0] || !quote) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    const file = photoInput.files[0];
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        alert(`Фото слишком большое! Максимальный размер: ${maxSizeMB} МБ.`);
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        initDB().then(() => {
            const transaction = db.transaction(['teamMembers'], 'readwrite');
            const store = transaction.objectStore('teamMembers');
            store.add({ name, photo: event.target.result, quote });
            transaction.oncomplete = () => {
                loadTeamMembers();
                closeAddMemberModal();
                document.getElementById('memberName').value = '';
                document.getElementById('memberPhoto').value = '';
                document.getElementById('memberQuote').value = '';
            };
        });
    };
    reader.readAsDataURL(file);
}

let currentMemberId;
function showEditMemberForm(id, name, photo, quote) {
    currentMemberId = id;
    document.getElementById('editMemberName').value = name;
    document.getElementById('editMemberQuote').value = quote;

    const modal = document.getElementById('editMemberModal');
    if (modal) {
        modal.style.display = 'flex';
        document.querySelector('.overlay').style.display = 'block';
    }
}

function closeEditMemberModal() {
    const modal = document.getElementById('editMemberModal');
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
    }
}

function updateMember() {
    const name = document.getElementById('editMemberName').value;
    const photoInput = document.getElementById('editMemberPhoto');
    const quote = document.getElementById('editMemberQuote').value;

    if (!name || !quote) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
    }

    initDB().then(() => {
        const transaction = db.transaction(['teamMembers'], 'readwrite');
        const store = transaction.objectStore('teamMembers');
        const request = store.get(currentMemberId);

        request.onsuccess = (event) => {
            const member = event.target.result;
            let newPhoto = member.photo;

            if (photoInput.files && photoInput.files[0]) {
                const file = photoInput.files[0];
                const maxSizeMB = 5;
                const maxSizeBytes = maxSizeMB * 1024 * 1024;
                if (file.size > maxSizeBytes) {
                    alert(`Фото слишком большое! Максимальный размер: ${maxSizeMB} МБ.`);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    newPhoto = event.target.result;
                    store.put({ id: currentMemberId, name, photo: newPhoto, quote });
                    transaction.oncomplete = () => {
                        loadTeamMembers();
                        closeEditMemberModal();
                    };
                };
                reader.readAsDataURL(file);
            } else {
                store.put({ id: currentMemberId, name, photo: newPhoto, quote });
                transaction.oncomplete = () => {
                    loadTeamMembers();
                    closeEditMemberModal();
                };
            }
        };
    });
}

function deleteMember(id) {
    if (!isAdmin) {
        alert('Только администратор может удалять членов!');
        return;
    }
    initDB().then(() => {
        const transaction = db.transaction(['teamMembers'], 'readwrite');
        const store = transaction.objectStore('teamMembers');
        store.delete(id);
        transaction.oncomplete = () => loadTeamMembers();
    });
}

function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('join-form');
    const status = document.getElementById('status');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (data.ageOOC < 13 || data.ageOOC > 120) {
        status.textContent = 'Укажите корректный возраст (13-120 лет)!';
        status.style.color = '#ff4500';
        return;
    }

    if (data.bestSkill === 'Другое' && !data.otherSkillInput) {
        status.textContent = 'Укажите свой вариант в поле "Укажите свой вариант"!';
        status.style.color = '#ff4500';
        return;
    }

    const discord = data.discord;
    if (!discord) {
        status.textContent = 'Пожалуйста, укажите Discord!';
        status.style.color = '#ff4500';
        return;
    }

    let message = `**Новая заявка в семью Family Dargon**\n`;
    message += `**Имя (OOC):** ${data.realName}\n`;
    message += `**Возраст (OOC):** ${data.ageOOC}\n`;
    message += `**Местоположение (OOC):** ${data.location}\n`;
    message += `**Часовой пояс (OOC):** ${data.timezone}\n`;
    message += `**Средний онлайн:** ${data.averageOnline}\n`;
    message += `**Готовность двигаться с семьей:** ${data.moveWithFamily}\n`;
    message += `**Что получается лучше всего:** ${data.bestSkill === 'Другое' ? data.otherSkillInput : data.bestSkill}\n`;
    message += `**Предпочтения:** ${data.preference}\n`;
    message += `**Предыдущие организации:** ${data.previousOrganizations}\n`;
    message += `**Discord:** ${data.discord}\n`;

    const webhookUrl = 'https://discord.com/api/webhooks/1283394800900374561/jXFQEr-ssG45oKO-z9cx0nCw0M6uVGPBY-QYGzVo0cXVzKNKsgUaUVooRC-oxsqBxBrH';

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
    })
    .then(response => {
        if (response.ok) {
            status.textContent = 'Заявка успешно отправлена в Discord!';
            status.style.color = '#00ffcc';
            form.reset();
            document.getElementById('otherSkillField').style.display = 'none';
        } else {
            status.textContent = 'Ошибка при отправке заявки. Попробуйте позже.';
            status.style.color = '#ff4500';
            console.error('Ошибка HTTP:', response.status);
        }
    })
    .catch(error => {
        status.textContent = 'Ошибка: ' + error.message;
        status.style.color = '#ff4500';
        console.error('Ошибка:', error);
    });
}

async function sendToDiscord(event, type) {
    event.preventDefault();
    const form = type === 'message' ? document.getElementById('message-form') :
                document.getElementById('complaint-form');
    const status = type === 'message' ? document.getElementById('message-status') :
                  document.getElementById('complaint-status');
    
    const name = form.querySelector('[name="name"]').value;
    const discord = form.querySelector('[name="discord"]').value;
    const message = form.querySelector('[name="message"]').value;

    let target = '';
    let file = null;
    let videoLink = '';

    if (type === 'complaint') {
        target = form.querySelector('[name="target"]').value;
        const fileInput = form.querySelector('[name="file"]');
        file = fileInput.files[0];
        videoLink = form.querySelector('[name="video-link"]')?.value || '';
    }

    if (!name || !discord || !message || (type === 'complaint' && !target)) {
        status.textContent = 'Пожалуйста, заполните все обязательные поля!';
        status.style.color = '#ff4500';
        return;
    }

    const webhookUrl = type === 'message'
        ? 'https://discord.com/api/webhooks/1347657602657685594/yMy8AW-B2AwUCG3Sr0De0g-A-kcoyo90HtjVdsNKgkB8H8ou3FSUiHu_mtskTCYfYJPm'
        : 'https://discord.com/api/webhooks/1351571821740294144/pCQaL4MCashYTXXntu7CGlTKlHsv4lj6yZMoRdoIArDifUrHwMvEzSbXB6GHq_BMAfLK';

    const formData = new FormData();
    let content = '';
    if (type === 'message') {
        content = `**Новое сообщение от ${name}**\n**Discord:** ${discord}\n**Сообщение:**\n${message}`;
    } else if (type === 'complaint') {
        content = `**Новая жалоба от ${name}**\n**Discord:** ${discord}\n**На кого:** ${target}\n**Описание:**\n${message}`;
        if (videoLink) {
            content += `\n**Ссылка на видео (YouTube):** ${videoLink}`;
        }
    }

    formData.append('content', content);

    if (type === 'complaint' && file) {
        const maxSizeMB = 8; // Discord ограничивает размер файла до 8 МБ для обычных вебхуков
        if (file.size > maxSizeMB * 1024 * 1024) {
            status.textContent = `Файл слишком большой! Максимальный размер: ${maxSizeMB} МБ.`;
            status.style.color = '#ff4500';
            return;
        }
        formData.append('file', file, file.name);
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            status.textContent = type === 'message' ? 'Сообщение успешно отправлено!' :
                               'Жалоба успешно отправлена!';
            status.style.color = '#00ffcc';
            form.reset();
            setTimeout(() => status.textContent = '', 5000);
        } else {
            const errorText = await response.text();
            status.textContent = 'Ошибка при отправке. Попробуйте позже.';
            status.style.color = '#ff4500';
            console.error('Ошибка HTTP:', response.status, errorText);
        }
    } catch (error) {
        status.textContent = 'Ошибка: ' + error.message;
        status.style.color = '#ff4500';
        console.error('Ошибка:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    loadEvents();
    loadTeamMembers();

    const userIconContainer = document.getElementById('userIconContainer');
    if (userIconContainer) {
        userIconContainer.addEventListener('click', showLoginModal);
        userIconContainer.style.cursor = 'pointer';
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const skillSelect = document.getElementById('bestSkill');
    const otherSkillField = document.getElementById('otherSkillField');
    if (skillSelect && otherSkillField) {
        skillSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Другое') {
                otherSkillField.style.display = 'block';
            } else {
                otherSkillField.style.display = 'none';
                document.getElementById('otherSkillInput').value = '';
            }
        });
    }
});