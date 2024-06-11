import axios from 'axios';
import Member from '../schema/Member.js';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function getUserByEmail(email) {
    try {
        const url = `${process.env.AUTH_SERVER}/user-info?email=${email}`;

        const res = await axios.get(url);

        const { user } = res.data;

        return user;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function getUserById(id) {
    try {
        const url = `${process.env.AUTH_SERVER}/user-info?id=${id}`;

        const res = await axios.get(url);

        const { user } = res.data;

        return user;
    } catch (e) {
        console.log(e);
        return null;
    }
}

async function uploadIssueFiles(filePaths, req) {
    if (!filePaths.length) return [];

    console.log({ filePaths });
    try {
        const organizationId = req.org.id;
        const token = req.user.token;

        const owner = await Member.findOne({ organizationId, role: 'owner' });

        if (!owner) Error.throw('something went wrong');

        const formData = new FormData();

        filePaths.forEach(filePath => {
            const file = fs.readFileSync(filePath);
            formData.append('files', file, { filename: path.basename(filePath) });
        });

        const response = await axios.post(
            `${process.env.FILES_API}/file/projects/${owner.userId}`,
            formData,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Encoding': 'multipart/form-data',
                },
            }
        );

        const { success, errors, uploaded } = response.data;
        if (!success) Error.throw(errors.pop(), 400);

        filePaths.forEach(path => fs.unlinkSync(path));

        console.log({ uploaded });
        return uploaded;
    } catch (e) {
        Error.throw(e);
        console.log(e);
    }
}

async function deleteIssueFiles(fileIds, req) {
    try {
        const organizationId = req.org.id;
        const token = req.user.token;

        const owner = await Member.findOne({ organizationId, role: 'owner' });

        if (!owner) Error.throw('something went wrong');

        const response = await axios.patch(
            `${process.env.FILES_API}/file/projects/${owner.userId}`,
            { files: fileIds },
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        );

        const { success, errors } = response.data;
        if (!success) Error.throw(errors.pop(), 400);
    } catch (e) {
        Error.throw(e);
        console.log(e);
    }
}

async function removeMismatchImages(htmlString, imageIds, req) {
    const toRemove = [];

    imageIds.forEach((id, i) => {
        if (!htmlString.includes(id)) {
            toRemove.push(id);
            imageIds.splice(i, 1);
        }
    });

    if (!toRemove.length) return;
    await deleteIssueFiles(toRemove, req);
}

async function getLogs(dataSource, query, limit) {
    const activities = await dataSource.aggregate([
        {
            $lookup: {
                from: 'issues',
                localField: 'correspondId.issue',
                foreignField: '_id',
                as: 'issue',
                pipeline: [
                    {
                        $project: {
                            assignee: 1,
                            reporter: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                participants: {
                    $filter: {
                        input: [
                            '$userId',
                            {
                                $getField: {
                                    input: {
                                        $arrayElemAt: ['$issue', 0],
                                    },
                                    field: 'assignee',
                                },
                            },
                            {
                                $getField: {
                                    input: {
                                        $arrayElemAt: ['$issue', 0],
                                    },
                                    field: 'reporter',
                                },
                            },
                        ],
                        as: 'participant',
                        cond: {
                            $ne: ['$$participant', null],
                        },
                    },
                },
            },
        },
        {
            $match: {
                ...query,
            },
        },
        {
            $sort: {
                time: -1,
            },
        },
        ...(limit
            ? [
                  {
                      $limit: limit,
                  },
              ]
            : []),

        {
            $lookup: {
                from: 'users',
                localField: 'performerId',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                        },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$user',
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$$ROOT', '$user'],
                },
            },
        },
        {
            $project: {
                user: 0,
                issue: 0,
                participants: 0,
                __v: 0,
            },
        },
    ]);

    return activities;
}

export {
    getUserByEmail,
    getUserById,
    deleteIssueFiles,
    uploadIssueFiles,
    removeMismatchImages,
    getLogs,
};
