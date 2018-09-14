import { Router } from 'express';
import path from 'path';

const router = new Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //  res.render('index', {
  //    title: 'Express'
  //  });
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

export default router;
