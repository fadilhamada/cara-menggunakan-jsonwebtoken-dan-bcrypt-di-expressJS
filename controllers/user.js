const {PrismaClient} = require('@prisma/client')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const { response, validation } = require('../views/response')

const prisma = new PrismaClient()
dotenv.config()

const getUser = async (req, res, next) => {
    try {
        const result = await prisma.user.findMany()
        result.length <= 0 ? validation(404, 'Data masih kosong', res) : response(200, result, 'Data berhasil ditampilkan', res)
    } catch (error) {
        next(error)
    }
}

const getUserId = async (req, res, next) => {
    const { id } = req.params
    try {
        const result = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })
        !result ? validation(404, 'Data dicari tidak ada', res) : response(200, result, 'Data berhasil ditampilkan', res)
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    const { nama, user, pass } = req.body
    try {
        if(!nama || !user || !pass) {
            return validation(404, 'Silahkan isi data yang masih kosong', res)
        }
        const result = await prisma.user.create({
            data: {
                nama,
                username: user,
                password: bcrypt.hashSync(pass, 10)
            }
        })
        response(201, result, 'Data berhasil ditambahkan', res)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    const { id } = req.params
    const { nama, user, pass } = req.body
    try {
        if(!nama || !user || !pass) {
            return validation(404, 'Silahkan isi data yang masih kosong', res)
        }
        const find = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })
        if(!find) {
            return validation(404, 'Data yang diubah tidak ada', res)
        }
        const result = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                nama,
                username: user,
                password: bcrypt.hashSync(pass, 10)
            }
        })
        response(201, result, 'Data berhasil ditambahkan', res)
    } catch (error) {
        next(error)
    }
}

const destroy = async (req, res, next) => {
    const { id } = req.params
    try {
        const find = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })
        if(!find) {
            return validation(404, 'Data yang dihapus tidak ada', res)
        }
        const result = await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
        response(200, result, 'Data berhasil ditambahkan', res)
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    const { user, pass } = req.body
    try {
        if(!user || !pass) {
            return validation(404, 'Silahkan isi data yang masih kosong', res)
        }
        const result = await prisma.user.findFirst({
            where: {
                username: user
            }
        })
        if(!result) {
            return validation(404, 'Username atau password salah', res)
        }
        const compare = bcrypt.compareSync(pass, result.password)
        if(!compare) {
            return validation(404, 'Username atau password salah', res)
        }
        const token = jwt.sign(result, process.env.SECRET_TOKEN, {expiresIn: '1h'})
        res.json({
            status: 200,
            message: 'Berhasil login',
            data: result,
            token
        })
    } catch (error) {
        next(error)
    }
}

const authenticateToken = async (req, res, next) => {
    const token = req.header('auth-token')
    try {
        if(!token) {
            return validation(404, 'Tidak ada akses ke halaman ini', res)
        }
        jwt.decode(token, process.env.SECRET_TOKEN)
        next()
    } catch (error) {
        next(error)        
    }
}

module.exports = {
    getUser,
    getUserId,
    create,
    update,
    destroy,
    login,
    authenticateToken
}