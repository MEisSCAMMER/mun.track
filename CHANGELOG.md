Changelog:

* **v1.0.0**: Initial release.
* **v1.0.1**: Changed typeface to Helvetica Neue and changed "Czech Republic" to "Czechia" in country list.
* **v1.0.2**: Added South Sudan to country list (oops)
* **v1.1.0**: Several new features:
    * Timer dialogs now accept times in mm format (previously only mm:ss was accepted).
    * Country prompts now fail for strings less than 3 characters long instead of auto-suggesting "Chad."
    * Commands are now case-sensitive, to allow for more commands in future...
    * ...such as the new `D`/`deleteall` command, which removes all delegates from the current speakers list.
    * The spacebar now pauses all timers, including mod and large timers. To move to the next speaker in a mod, use enter.
    * Made the "help" dialog more readable.
    * "Czech Republic" was re-added to the country list. ("Czechia" still works)

* **v1.2.0**: Several updates:
    * Fixed some margins on the header.
    * Backend overhaul; commands are now stored in a dictionary.
    * This was done to help with the creation of the new command `remap`, which allows you to remap commands to different keys.
      * (That one's not actually done yet though.)
    * What IS done yet though is the new command `w`/`whip`, which starts a whip: essentially an infinite series of 
big timers.
    * Timers now shake for about a second when done instead of indefinitely.
* **v1.2.1**: Fixed a bug for whips which caused issues when the timer was reset while paused.
* **v1.2.2**: Changed default typeface to Inter, which unlike Helvetica is open-source.
* **v1.2.3**: Fixed a bug which under rare circumstances caused the mod speaker time to turn red permanently.
