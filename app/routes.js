const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ==========================================
// STEP 1: ACTION PAGE (entry selection)
// ==========================================
router.post('/navigation', (req, res) => {
  let selected = req.body.documents

  if (!selected) return res.redirect('/navigation')
  if (!Array.isArray(selected)) selected = [selected]

  const pickedDownload = selected.includes('download')
  const pickedUpload = selected.includes('upload') // ✅ FIXED

  const journey = []

  if (pickedDownload) {
    journey.push('download')
  }

  if (pickedUpload) {
    journey.push('navigation')
  }

  req.session.data.journey = journey

  console.log("JOURNEY AFTER ACTION =", journey)

  // Decide where to go first
  if (pickedDownload) {
    return res.redirect('/download')
  }

  if (pickedUpload) {
    return res.redirect('/navigation')
  }

  return res.redirect('/navigation')
})


// ==========================================
// STEP 2: NAVIGATION PAGE (upload choices)
// ==========================================
router.post('/navigation-step', (req, res) => {
  let selected = req.body.documents

  if (!selected) return res.redirect('/navigation')
  if (!Array.isArray(selected)) selected = [selected]

  const pickedFinancial = selected.includes('upload-financial')
  const pickedAdditional = selected.includes('upload-additional')

  let journey = req.session.data.journey || []

  // Remove old upload steps
  const navIndex = journey.indexOf('navigation')
  if (navIndex !== -1) {
    journey = journey.slice(0, navIndex + 1)
  }

  // Add new steps
  if (pickedFinancial) {
    journey.push('upload-financial')
  }

  if (pickedAdditional) {
    journey.push('upload-additional')
  }

  req.session.data.journey = journey

  console.log("FULL JOURNEY AFTER NAV =", journey)

  // Route to first page
  if (pickedFinancial) {
    return res.redirect('/upload-financial')
  }

  if (pickedAdditional) {
    return res.redirect('/upload-additional')
  }

  return res.redirect('/navigation')
})


// ==========================================
// HELPER: NEXT STEP
// ==========================================
function nextStep(req, res, page) {
  const journey = req.session.data.journey || []
  const index = journey.indexOf(page)

  if (index !== -1 && index < journey.length - 1) {
    return res.redirect(`/${journey[index + 1]}`)
  }

  return res.redirect('/declaration')
}


// ==========================================
// DOWNLOAD
// ==========================================
router.get('/download', (req, res) => {
  res.render('download', {
    currentPage: 'download',
    journey: req.session.data.journey || []
  })
})

router.post('/download', (req, res) => {
  return nextStep(req, res, 'download')
})


// ==========================================
// NAVIGATION PAGE
// ==========================================
router.get('/navigation', (req, res) => {
  res.render('navigation', {
    currentPage: 'navigation',
    journey: req.session.data.journey || []
  })
})


// ==========================================
// UPLOAD: FINANCIAL
// ==========================================
router.get('/upload-financial', (req, res) => {
  res.render('upload-financial', {
    currentPage: 'upload-financial',
    journey: req.session.data.journey || []
  })
})

router.post('/upload-financial', (req, res) => {
  return nextStep(req, res, 'upload-financial')
})


// ==========================================
// UPLOAD: ADDITIONAL
// ==========================================
router.get('/upload-additional', (req, res) => {
  res.render('upload-additional', {
    currentPage: 'upload-additional',
    journey: req.session.data.journey || []
  })
})

router.post('/upload-additional', (req, res) => {
  return nextStep(req, res, 'upload-additional')
})


// ==========================================
// DECLARATION
// ==========================================
router.get('/declaration', (req, res) => {
  res.render('declaration', {
    currentPage: 'declaration',
    journey: req.session.data.journey || []
  })
})

module.exports = router


router.get('/fo-select', (req, res) => {
  res.render('fo-select', {
    currentPage: 'fo-select',
    journey: req.session.data.journey || []
  })
})

router.post('/fo-select', (req, res) => {
  return nextStep(req, res, 'fo-select')
})


router.get('/fo-confirm', (req, res) => {
  res.render('fo-confirm', {
    currentPage: 'fo-confirm',
    journey: req.session.data.journey || []
  })
})


router.post('/fo-confirm', (req, res) => {
  res.redirect('/fo-confirm')
})
