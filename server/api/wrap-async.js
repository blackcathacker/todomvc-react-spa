
export default function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next)
      .catch(err => {
        console.error(err);
        res.status(500).send(err.message);
      });
  }
}
