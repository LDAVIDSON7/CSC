const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ---------------------------
// GET ROUTES
// ---------------------------

// Navigation page GET
router.get('/navigation', function (req, res) {
  res.render('navigation', {
    currentPage: 'navigation',
    journey: req.session.data.journey || []
  })
})

// Upload pages GET
router.get('/upload-group', function (req, res) {
  res.render('upload-group', {
    currentPage: 'upload-group',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-financial', function (req, res) {
  res.render('upload-financial', {
    currentPage: 'upload-financial',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-additional', function (req, res) {
  res.render('upload-additional', {
    currentPage: 'upload-additional',
    journey: req.session.data.journey || []
  })
})

// Confirmation GET
router.get('/confirmation', function (req, res) {
  res.render('confirmation', {
    currentPage: 'confirm-submit',
    journey: req.session.data.journey || []
  })
})

// ---------------------------
// POST ROUTES
// ---------------------------

// Navigation page POST
router.post('/navigation', function (req, res) {
  let selected = req.session.data.documents || []

  // Convert single selection to array
  if (!Array.isArray(selected)) selected = [selected]

  // Save journey in session
  req.session.data.journey = selected

  // Redirect to first selected page
  res.redirect(`/${selected[0]}`)
})

// Upload pages POST
router.post('/upload-group', (req, res) => nextStep(req, res, 'upload-group'))
router.post('/upload-financial', (req, res) => nextStep(req, res, 'upload-financial'))
router.post('/upload-additional', (req, res) => nextStep(req, res, 'upload-additional'))

// ---------------------------
// Helper
// ---------------------------
function nextStep(req, res, currentPage) {
  let journey = req.session.data.journey || []
  if (!Array.isArray(journey)) journey = [journey]

  const index = journey.indexOf(currentPage)

  if (index === -1) return res.redirect('/navigation')
  if (index === journey.length - 1) return res.redirect('/confirmation')

  res.redirect(`/${journey[index + 1]}`)
}

module.exports = router