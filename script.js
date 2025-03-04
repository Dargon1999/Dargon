function scrollToSection() {
    document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
}

function scrollToLeader() {
    document.getElementById('leader').scrollIntoView({ behavior: 'smooth' });
}

function toggleOtherSkill(select) {
    const otherSkillField = document.getElementById('otherSkillField');
    if (select.value === 'Другое') {
        otherSkillField.style.display = 'block';
        document.getElementById('otherSkillInput').required = true;
    } else {
        otherSkillField.style.display = 'none';
        document.getElementById('otherSkillInput').required = false;
        document.getElementById('otherSkillInput').value = ''; // Очистка поля
    }
}

function submitForm(event) {
    event.preventDefault();
    
    const realName = document.getElementById('realName').value;
    const ageOOC = document.getElementById('ageOOC').value;
    const location = document.getElementById('location').value;
    const timezone = document.getElementById('timezone').value;
    const averageOnline = document.getElementById('averageOnline').value;
    const moveWithFamily = document.getElementById('moveWithFamily').value;
    const bestSkill = document.getElementById('bestSkill').value;
    const otherSkillInput = document.getElementById('otherSkillInput').value;
    const preference = document.getElementById('preference').value;
    const previousOrganizations = document.getElementById('previousOrganizations').value;
    const discord = document.getElementById('discord').value;

    // Форматируем данные для отправки в Discord, включая "Другое" (если выбрано)
    let bestSkillText = bestSkill;
    if (bestSkill === 'Другое' && otherSkillInput) {
        bestSkillText += `: ${otherSkillInput}`;
    }

    // Форматируем данные для отправки в Discord
    const discordPayload = {
        content: `Новая заявка в семью Family Dargon:\n` +
                 `**Ваше имя [OOC]:** ${realName}\n` +
                 `**Сколько вам лет? [OOC]:** ${ageOOC}\n` +
                 `**Откуда вы? [OOC]:** ${location}\n` +
                 `**Ваш часовой пояс [OOC]:** ${timezone}\n` +
                 `**Ваш средний онлайн:** ${averageOnline}\n` +
                 `**Готовы ли вы двигаться вместе с семьей?** ${moveWithFamily}\n` +
                 `**Что у вас получается больше всего?** ${bestSkillText}\n` +
                 `**Что вы предпочитаете:** ${preference}\n` +
                 `**В каких организациях ранее состояли:** ${previousOrganizations}\n` +
                 `**Ваш Discord:** ${discord}`
    };

    // Отправляем данные на Discord Webhook
    fetch('https://discord.com/api/webhooks/1283394800900374561/jXFQEr-ssG45oKO-z9cx0nCw0M6uVGPBY-QYGzVo0cXVzKNKsgUaUVooRC-oxsqBxBrH', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('status').textContent = 'Заявка успешно отправлена в Discord!';
            document.getElementById('join-form').reset();
            document.getElementById('otherSkillField').style.display = 'none'; // Скрываем поле "Другое" после отправки
            document.getElementById('otherSkillInput').value = ''; // Очистка поля "Другое"
        } else {
            document.getElementById('status').textContent = 'Ошибка при отправке заявки. Попробуйте позже.';
        }
    })
    .catch(error => {
        document.getElementById('status').textContent = 'Ошибка: ' + error.message;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Сайт загружен!');
});