const assignedToask = require('../models/Task');
const PDFDocument = require('pdfkit');

exports.createTask = async (req, res) => {
    try{
        const task = new Task({...req.body, createdBy: req.user._id});
        await task.save();
        res.status(201).json({message: 'Task created successfully', task});

    }catch (err) {
        res.status(400).json({ error: 'Error creating task', details: err.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try{
        const { stattus, search } = req.query;
        let query = { createdBy: req.user._id };

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ deadline: 1 });
        res.json(tasks);

        }catch (err) {
            res.status(500).json({ error: 'Error fetching tasks', details: err.message });
        }
    };

    exports.generatePDF = async (re, res) => {
        try {
            const tasks = await Task.find({ createdBy: req.user._id });
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=tasks-report.pdf');

            doc.pipe(res);
            doc.fontSize(20).text('Tasks Report', { align: 'center' });
            doc.moveDown();

            tasks.forEach(task => {
                doc.fontSize(14).text(`Title: ${task.title}`);
                doc.fontSize(12).text(`Description: ${task.description}`);
                doc.text(`Status: ${task.status}`);
                doc.text(`Deadline: ${task.deadline.toDateString()}`);
                doc.moveDown();
              });

            doc.end();
        }catch (err) {
            res.status(500).json({ error: 'Error generating PDF', details: err.message });
        }
    };
