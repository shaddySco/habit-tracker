// notifyPartners.js
// Call this whenever a habit is added, edited, or deleted.
// Opens Gmail compose for every partner who has this category.

export function notifyPartnersOfGoalChange({ state, catId, changeType, habitText, oldText }) {
    const username = state.username || 'Your friend'
    const cat = state.cats.find(c => c.id === catId)
    if (!cat) return 0

    const partners = state.partnerGroups?.[catId] || []

    // Also check legacy single-partner slot
    const legacyPartner = state.partners?.[catId]
    const allPartners = [...partners]
    if (legacyPartner?.email && !partners.find(p => p.email === legacyPartner.email)) {
        allPartners.push({ ...legacyPartner, id: 'legacy' })
    }

    if (!allPartners.length) return 0

    // Build current goals list for context
    const daily = cat.habits.filter(h => h.freq === 'daily')
    const weekly = cat.habits.filter(h => h.freq === 'weekly')
    const monthly = cat.habits.filter(h => h.freq === 'monthly')
    const formatSection = (label, habits) =>
        habits.length ? `[${label}]\n${habits.map(h => `  • ${h.text}`).join('\n')}` : ''
    const goalList = [
        formatSection('Daily', daily),
        formatSection('Weekly', weekly),
        formatSection('Monthly', monthly),
    ].filter(Boolean).join('\n\n') || 'No goals set yet.'

    // Change description
    const changeDesc = {
        added: `➕ New goal added: "${habitText}"`,
        edited: `✏️ Goal updated: "${oldText}" → "${habitText}"`,
        deleted: `🗑 Goal removed: "${habitText}"`,
    }[changeType] || `Goal changed in ${cat.label}`

    allPartners.forEach((p, i) => {
        setTimeout(() => {
            const subject = `[Update] ${username}'s ${cat.label} goals have changed`
            const body = `Hey ${p.name || 'there'},

Just a quick update — ${username} has made a change to their ${cat.label} goals.

${changeDesc}

━━━━━━━━━━━━━━━━━━━━━
CURRENT ${cat.label.toUpperCase()} GOALS
━━━━━━━━━━━━━━━━━━━━━
${goalList}

As their accountability partner, you can check in and ask how the change is going.

Keep encouraging them — your support matters!

— ${username}'s Habit Tracker 🌱`

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            window.open(gmailUrl, '_blank')
        }, i * 700)
    })

    return allPartners.length
}