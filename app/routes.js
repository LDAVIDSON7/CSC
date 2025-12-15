const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ---------------------------
// VALID PAGE NAMES
// ---------------------------
const VALID_PAGES = ['upload-group', 'upload-financial', 'upload-additional']

// ---------------------------
// POST ROUTES
// ---------------------------

// Handle form submission from navigation page
router.post('/navigation', (req, res) => {
  let selected = req.body.documents

  // If nothing selected, redirect back
  if (!selected) return res.redirect('/navigation')

  // Ensure always an array
  if (!Array.isArray(selected)) selected = [selected]

  // Filter out invalid values (prevents '_unchecked')
  selected = selected.filter(p => VALID_PAGES.includes(p))

  // Save journey in session
  req.session.data.journey = selected

  console.log('Navigation POST — selected:', selected)
  console.log('Saved in session:', req.session.data.journey)

  // Redirect to first selected page, or navigation if none valid
  if (selected.length === 0) return res.redirect('/navigation')
  res.redirect(`/${selected[0]}`)
})

// Handle "Continue" button on each upload page
router.post('/upload-group', (req, res) => nextStep(req, res, 'upload-group'))
router.post('/upload-financial', (req, res) => nextStep(req, res, 'upload-financial'))
router.post('/upload-additional', (req, res) => nextStep(req, res, 'upload-additional'))

// ---------------------------
// Helper: next step
// ---------------------------
function nextStep(req, res, currentPage) {
  let journey = req.session.data.journey || []

  // Always ensure journey is an array
  if (!Array.isArray(journey)) journey = [journey]

  console.log(`NextStep — currentPage: ${currentPage}, journey:`, journey)

  // Remove any invalid entries
  journey = journey.filter(p => VALID_PAGES.includes(p))

  const index = journey.indexOf(currentPage)

  if (index === -1) {
    console.log('Current page not in journey — redirecting to /navigation')
    return res.redirect('/navigation')
  }

  if (index === journey.length - 1) {
    console.log('Last page reached — redirecting to /declaration')
    return res.redirect('/declaration')
  }

  const nextPage = journey[index + 1]
  console.log(`Redirecting to next page: /${nextPage}`)
  res.redirect(`/${nextPage}`)
}

// ---------------------------
// GET ROUTES
// ---------------------------

// Reset journey when visiting navigation page
router.get('/navigation', (req, res) => {
  req.session.data.journey = []
  res.render('navigation', {
    currentPage: 'navigation',
    journey: req.session.data.journey
  })
})

router.get('/upload-group', (req, res) => {
  res.render('upload-group', {
    currentPage: 'upload-group',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-financial', (req, res) => {
  res.render('upload-financial', {
    currentPage: 'upload-financial',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-additional', (req, res) => {
  res.render('upload-additional', {
    currentPage: 'upload-additional',
    journey: req.session.data.journey || []
  })
})

router.get('/declaration', (req, res) => {
  res.render('declaration', {
    currentPage: 'declaration',
    journey: req.session.data.journey || []
  })
})

module.exports = router