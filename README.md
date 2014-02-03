TAL Performance Monitor
=======================

This tool is designed as a getting useful information out of [TAL](https://github.com/fmtvp/tal) applications.

The information it gathers is sent via a GET request to the tpmdaemon.

TPM is designed to run on all devices and it is a bug if we cannot retrieve the information from a device. Raise them if you find them!

Dependencies
============
1. This relies on [TAL](https://github.com/fmtvp/tal).
2. To retrieve "frames per second" for animations you need to run [a modified version of TAL](https://github.com/rsjtaylor/tal/tree/tween).

Running
=======
1. You need to include a reference to the TAL performance monitor script in your TAL application AFTER the require.js definition.
2. Start the server by running `./tpmdaemon/server`. By default it runs on port 3000. You can see the options by running `./tpmdaemon/server --help`
3. Modify talperformancemonitor.js to point to your server.
4. Load your TAL application and you should the stats output to standard out by the server.

Known issues
============
- To get the information from a device you will need to disable your [firewall on Mac OSX](http://support.apple.com/kb/ht1810).

Useful links
============
- [To get statsd and Graphite set up on Mac OSX](http://steveakers.com/2013/03/12/installing-graphite-statsd-on-mountain-lion-2/) 
