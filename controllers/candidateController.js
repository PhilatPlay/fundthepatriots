const Candidate = require('../models/Candidate');

exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);

    } catch (err) {
        console.error(err.message);
        res.status(417).json(err.message);
    }
};

exports.createCandidate = async (req, res) => {
    const { name, description } = req.body;
    const picture = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newCandidate = new Candidate({
            name,
            description,
            picture,
        });

        const candidate = await newCandidate.save();
        res.json(candidate);

    } catch (err) {
        console.error(err.message);
        res.status(417).json(err.message);
    }
};

exports.deleteCandidate = async (req, res) => {
    try {

        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        candidate.active = false;

        candidate = await candidate.save();
        res.json({ msg: 'Candidate deactivated' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
}

exports.updateCandidate = async (req, res) => {

    let { name, description } = req.body;
    picture = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        candidate.name = name ? name : candidate.name;
        candidate.description = description ? description : candidate.description
        candidate.picture = picture ? picture : candidate.picture;

        candidate = await candidate.save();
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(417).json(err.message);
    }
};

exports.getCandidate = async (req, res) => {
    try {
        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);

    } catch (err) {
        console.error(err.message);
        res.status(417).json(err.message);
    }
}





