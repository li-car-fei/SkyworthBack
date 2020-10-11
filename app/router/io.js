module.exports = app => {
    const { io, controller } = app;

    // socket io
    io.of('/').route('exchange', io.controller.default.ping);
}