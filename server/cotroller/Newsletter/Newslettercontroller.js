
const Contact=require('../../model/contactmodel')
const Newsletter=require('../../model/Newslettermodel')

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already subscribed" });

    const subscriber = await Newsletter.create({ email });
    res.status(201).json(subscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteNewsletterSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) return res.status(404).json({ message: "Subscriber not found" });

    await subscriber.deleteOne();
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contactMessage = await Contact.create({ name, email, message });
    res.status(201).json(contactMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteContactMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
