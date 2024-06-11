// import User from '../../schema/User.js';

// export default async function (req, res, next) {
//     const { oldPassword, newPassword } = req.body;
//     const { id } = req.user;

//     try {
//         const user = await User.findById(id);
//         console
//         if (await user.isUnauthorized(oldPassword)) {
//             Error.throw('Password is Incorrect');
//         }

//         user.password = newPassword;

//         await user.save();

//         res.success('Password Changed successfully');
//     } catch (e) {
//         next(e);
//     }
// }
